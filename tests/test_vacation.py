"""One durable vacation authority, exact migration, sessions and old clients."""
from copy import deepcopy
from datetime import date
from types import SimpleNamespace as NS
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.family_access_manager.runtime import AccessDenied
from custom_components.family_access_manager.vacation import CLIENTS, EVENT, Vacation, periods, register_service
from custom_components.family_access_manager import vacation_client as client


def legacy(enabled=False, started=None, periods=None):
    return {'enabled':enabled,'started':started,'periods':periods or []}


async def test_only_admin_can_change_shared_mode(runtime, child, hass_admin_user):
    before=deepcopy(runtime.vacation.data)
    with pytest.raises(AccessDenied):
        await runtime.dispatch(child[0],'set_vacation',{'enabled':True,'revision':0})
    assert runtime.vacation.data==before
    assert runtime.error_log.snapshot()[0]['operation']=='set_vacation'
    result=await runtime.dispatch(hass_admin_user,'set_vacation',{'enabled':True,'revision':0})
    assert result['enabled'] is True
    assert not child[0].is_admin
    # Role/configuration revisions and bindings are entirely independent.
    assert runtime.policy.config['revision']==0
    with pytest.raises(ValueError):
        await runtime.dispatch(hass_admin_user,'set_vacation',{'enabled':False,'revision':0})
    assert runtime.vacation.data['enabled']


async def test_legacy_active_sources_merge_once_and_explicit_central_choice_wins(runtime, hass_admin_user):
    v=runtime.vacation
    await v.import_legacy('light_manager',legacy(False))
    await v.import_legacy('hausarbeiten_manager',legacy(True,'2026-11-10',[{'start':'2026-10-01','end':'2026-10-03'}]))
    assert v.data['enabled'] and v.data['started']=='2026-11-10'
    revision=v.data['revision']
    await v.import_legacy('hausarbeiten_manager',legacy(False))
    assert v.data['revision']==revision
    await runtime.dispatch(hass_admin_user,'set_vacation',{'enabled':False,'revision':revision})
    await v.import_legacy('rollladenplaner',legacy(True))
    assert not v.data['enabled']
    assert v.data['periods'][0]=={'start':'2026-10-01','end':'2026-10-03'}


async def test_ending_vacation_preserves_past_days_but_resumes_today(runtime, freezer):
    freezer.move_to('2026-11-10T10:00:00Z')
    v=runtime.vacation
    await v.set(True)
    freezer.move_to('2026-11-15T10:00:00Z')
    await v.set(False)
    assert v.data['periods']==[{'start':'2026-11-10','end':'2026-11-14'}]
    assert v.data['started'] is None
    await v.set(True)
    assert v.data['started']=='2026-11-15'


async def test_failed_storage_keeps_all_consumers_on_confirmed_state(runtime, hass):
    v=runtime.vacation
    await v.import_legacy('light_manager',legacy(False))
    before=deepcopy(v.data)
    events=[]
    unsub=hass.bus.async_listen(EVENT,lambda event:events.append(event))
    with patch.object(v.store,'async_save',side_effect=OSError('disk')):
        with pytest.raises(OSError):await v.set(True)
    await hass.async_block_till_done()
    assert v.data==before
    assert client.snapshot(hass,legacy(False),'light_manager')['enabled'] is False
    assert events==[]
    unsub()


async def test_state_and_migration_markers_survive_restart(runtime, hass):
    v=runtime.vacation
    await v.import_legacy('light_manager',legacy(True))
    await v.set(False)
    reloaded=Vacation(hass)
    await reloaded.load()
    assert reloaded.data==v.data
    await reloaded.import_legacy('light_manager',legacy(True))
    assert not reloaded.data['enabled']


async def test_consumer_keeps_history_until_import_is_durable(hass, runtime):
    # Consumer was set up before Family Access became available.
    hass.data.pop('family_access_manager')
    seed=legacy(True,'2026-11-01',[{'start':'2026-09-01','end':'2026-09-07'}])
    remove=await client.register(hass,'hausarbeiten_manager',lambda:deepcopy(seed),lambda:None)
    hass.data['family_access_manager']=runtime
    await runtime.vacation.import_legacy('light_manager',legacy(True))
    state=client.snapshot(hass,seed,'hausarbeiten_manager')
    assert not state['central'] and state['periods']==seed['periods']
    # The registered seed is frozen, even when a running app changes its cache.
    seed['periods']=[]
    saved=hass.data[CLIENTS]['hausarbeiten_manager']['legacy']()
    assert saved['periods']==[{'start':'2026-09-01','end':'2026-09-07'}]
    await runtime.vacation.import_legacy('hausarbeiten_manager',saved)
    assert client.snapshot(hass,seed,'hausarbeiten_manager')['periods']==saved['periods']
    remove()


async def test_consumer_retains_last_confirmed_pause_when_provider_unloads(hass,runtime):
    await runtime.vacation.import_legacy('light_manager',legacy(True))
    confirmed=client.snapshot(hass,legacy(False),'light_manager')
    hass.data.pop('family_access_manager')
    try:
        state=client.snapshot(hass,confirmed,'light_manager')
        assert state['enabled'] is True and not state['available']
    finally:hass.data['family_access_manager']=runtime


async def test_authenticated_ws_and_service_cannot_forge_other_users(hass,runtime,child,hass_admin_user,hass_ws_client):
    ws=await hass_ws_client(hass,access_token=child[1])
    await ws.send_json({'id':1,'type':'family_access_manager/request','action':'set_vacation','payload':{'enabled':True,'user_id':hass_admin_user.id}})
    assert not (await ws.receive_json())['success']
    assert not runtime.vacation.data['enabled']
    register_service(hass)
    from homeassistant.core import Context
    from homeassistant.exceptions import ServiceValidationError
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call('family_access_manager','set_vacation',{'enabled':True},blocking=True,context=Context(user_id=child[0].id))
    assert not runtime.vacation.data['enabled']
    await hass.services.async_call('family_access_manager','set_vacation',{'enabled':True},blocking=True,context=Context(user_id=hass_admin_user.id))
    assert runtime.vacation.data['enabled']
    await hass.services.async_call('family_access_manager','set_vacation',{'enabled':False},blocking=True)
    assert not runtime.vacation.data['enabled']


def test_historical_period_union_does_not_invent_gaps():
    assert periods([{'start':'2026-10-01','end':'2026-10-03'},{'start':'2026-10-03','end':'2026-10-05'},{'start':'2026-10-08','end':'2026-10-09'}])==[{'start':'2026-10-01','end':'2026-10-05'},{'start':'2026-10-08','end':'2026-10-09'}]


@pytest.mark.parametrize('value',[True,{'enabled':'false'}, {'enabled':True,'revision':True}])
async def test_invalid_vacation_requests_never_change_state(runtime,hass_admin_user,value):
    before=deepcopy(runtime.vacation.data)
    with pytest.raises((ValueError,TypeError)):
        await runtime.dispatch(hass_admin_user,'set_vacation',value)
    assert runtime.vacation.data==before
