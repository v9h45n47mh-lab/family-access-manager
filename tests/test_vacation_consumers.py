"""Real consumer managers against HA and the real central controller.

CI pins each consumer checkout. No physical device or external service is used.
"""
import importlib
import importlib.util
import os
from copy import deepcopy
from datetime import datetime, timedelta, timezone
from pathlib import Path
from types import SimpleNamespace as NS
from unittest.mock import AsyncMock

import pytest

from custom_components.family_access_manager import vacation_client
from custom_components.family_access_manager.vacation import EVENT


def fixtures(path, name):
    spec=importlib.util.spec_from_file_location(name,path)
    module=importlib.util.module_from_spec(spec)
    import sys
    sys.modules[name]=module
    spec.loader.exec_module(module)
    return module


@pytest.fixture
async def managers(hass,runtime):
    root=Path(os.environ.get('VACATION_CONSUMER_ROOT',Path(__file__).resolve().parents[2]))
    repos={'light_manager':'light-manager','rollladenplaner':'shutter-manager','hausarbeiten_manager':'hausarbeiten-manager'}
    if not all((root/repo/'custom_components'/domain/'__init__.py').exists() for domain,repo in repos.items()):
        if 'VACATION_CONSUMER_ROOT' in os.environ:raise AssertionError('Pinned consumer checkouts missing')
        pytest.skip('Consumer integration suite runs in the pinned cross-repository CI job')
    import custom_components
    for repo in repos.values():
        path=str(root/repo/'custom_components')
        if path not in custom_components.__path__:custom_components.__path__.append(path)
    modules={domain:importlib.import_module('custom_components.'+domain) for domain in repos}
    lf=fixtures(root/'light-manager/tests/test_engine.py','vacation_light_fixture')
    sf=fixtures(root/'shutter-manager/tests/test_engine.py','vacation_shutter_fixture')
    lm=modules['light_manager'].Manager(hass)
    lm.engine=modules['light_manager'].Engine(lf.fixture(lf.program('p','time',[lf.action(time='18:00')],pause_in_vacation=True)),tz=hass.config.time_zone)
    lm.execute=AsyncMock()
    sh=modules['rollladenplaner'].Manager(hass)
    config,_=sf.fixture();config['programs'][0]['pause_in_vacation']=True
    sh.engine=modules['rollladenplaner'].Engine(config,tz=hass.config.time_zone)
    sh.command=AsyncMock()
    hh=modules['hausarbeiten_manager'].Manager(hass,NS(data={'users':{'Vera':'v','Manuel':'m','Maximilian':'max','Paul':'p'}},options={}))
    result={'light_manager':lm,'rollladenplaner':sh,'hausarbeiten_manager':hh}
    removes=[]
    for domain,m in result.items():
        # Bind the actual manager type instead of the loop's mutable domain.
        if domain=='hausarbeiten_manager':notify=lambda m=m:hass.async_create_task(m.sync_vacation())
        else:notify=lambda m=m:hass.async_create_task(m.pulse())
        removes.append(await modules[domain].vacation_client.register(hass,domain,m.legacy_vacation,notify))
    await hass.async_block_till_done()
    yield result,modules
    for remove in removes:remove()
    await hass.async_block_till_done()


async def test_all_three_actual_consumers_follow_one_state_and_recover_after_unload(hass,runtime,managers):
    result,_=managers
    await runtime.vacation.set(True)
    await hass.async_block_till_done()
    assert result['light_manager'].engine.config['vacation'] is True
    assert result['rollladenplaner'].engine.config['vacation'] is True
    assert result['hausarbeiten_manager'].data['vacation_enabled'] is True
    # A central outage cannot make any manager resume its programs/tasks.
    hass.data.pop('family_access_manager')
    hass.bus.async_fire(EVENT,{'available':False})
    await hass.async_block_till_done()
    assert all(m.vacation_snapshot()['enabled'] for m in result.values())
    hass.data['family_access_manager']=runtime
    await runtime.vacation.set(False)
    await hass.async_block_till_done()
    assert not any(m.vacation_snapshot()['enabled'] for m in result.values())


async def test_editor_backups_and_local_endpoints_cannot_override_global_mode(hass,runtime,managers,hass_admin_user):
    result,_=managers
    await runtime.vacation.set(True)
    await hass.async_block_till_done()
    lm=result['light_manager'];config=deepcopy(lm.engine.config);config['vacation']=False
    # No unrelated light configuration is changed; target validation remains native.
    lm.validate_live=lambda config:None
    await lm.save(config,lm.revision)
    assert lm.engine.config['vacation'] is True
    sh=result['rollladenplaner'];config=deepcopy(sh.engine.config);config['vacation']=False
    await sh.save(config,sh.revision)
    assert sh.engine.config['vacation'] is True
    with pytest.raises(ValueError,match='zentral'):
        await sh.action(hass_admin_user,{'action':'vacation','value':False,'revision':sh.revision})
    hh=result['hausarbeiten_manager']
    with pytest.raises(PermissionError,match='zentral'):
        await hh.mutate({'parent':True,'person':'Vera','user_id':'v'},hh.data['revision'],'vacation',{'enabled':False})
    assert runtime.vacation.data['enabled']


async def test_native_household_calendars_and_completion_read_current_central_periods(hass,runtime,managers,freezer):
    freezer.move_to('2026-11-15T10:00:00Z')
    result,modules=managers
    hh=result['hausarbeiten_manager'];engine=importlib.import_module('custom_components.hausarbeiten_manager.engine')
    parent={'parent':True,'person':'Vera','user_id':'v'}
    child={'parent':False,'person':'Paul','user_id':'p','settings_allowed':False}
    hh.data=engine.save_task(hh.data,{'title':'Zimmer','assignees':['Paul'],'start':'2026-11-15','kind':'daily'},parent)
    before=engine.occurrences(hh.effective_data(),['Paul'],hh.today(),hh.today()+timedelta(days=6))
    assert before
    calendar_module=importlib.import_module('custom_components.hausarbeiten_manager.calendar')
    calendar_class=next(value for name,value in vars(calendar_module).items() if isinstance(value,type) and value.__module__==calendar_module.__name__)
    calendar=calendar_class(hh,'Paul')
    await runtime.vacation.set(True)
    # effective_data is authoritative even before the queued cache refresh runs.
    assert not await calendar.async_get_events(hass,datetime(2026,11,15,tzinfo=timezone.utc),datetime(2026,11,16,tzinfo=timezone.utc))
    await hass.async_block_till_done()
    task_id=hh.data['tasks'][0]['id']
    with pytest.raises((PermissionError,ValueError)):
        await hh.mutate(child,hh.data['revision'],'complete',{'task_id':task_id,'person':'Paul','date':'2026-11-15'})
    freezer.move_to('2026-11-17T10:00:00Z')
    await runtime.vacation.set(False)
    await hass.async_block_till_done()
    assert engine.vacation_on(hh.effective_data(),datetime(2026,11,16).date())
    assert not engine.vacation_on(hh.effective_data(),hh.today())
    assert await calendar.async_get_events(hass,datetime(2026,11,17,tzinfo=timezone.utc),datetime(2026,11,18,tzinfo=timezone.utc))
    assert hh.snapshot(child)['vacations']==[]
    assert set(hh.snapshot(child)['vacation'])=={'enabled','central','available'}
