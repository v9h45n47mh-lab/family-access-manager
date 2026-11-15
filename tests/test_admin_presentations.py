"""Admin display profiles filter navigation while preserving HA recovery access."""
from copy import deepcopy
from types import SimpleNamespace

import pytest
from test_sidebar import panels
from homeassistant.auth.const import GROUP_ID_ADMIN
from homeassistant.components.frontend.storage import async_user_store
from homeassistant.components.lovelace.const import LOVELACE_DATA

from custom_components.family_access_manager.const import PANEL_PATH
from custom_components.family_access_manager.gate import principal
from custom_components.family_access_manager.policy import InvalidPolicy, Policy, default_policy, migrate_policy, validate_policy


async def ws_result(ws,mid,command,**values):
    await ws.send_json({'id':mid,'type':command,**values})
    response=await ws.receive_json()
    assert response['success'],response
    return response['result']


@pytest.mark.parametrize('bad',[[],True,{'admin':'missing'},{'admin':['family']}])
def test_admin_display_mapping_is_strict(bad):
    c=default_policy();c['admin_presentations']=bad
    with pytest.raises(InvalidPolicy):validate_policy(c)


def test_previous_ignored_admin_bindings_never_implicitly_activate_a_presentation():
    old=default_policy();old.pop('admin_presentations')
    old['bindings']={'admin':['family']};old['enabled_users']=['admin']
    migrated=migrate_policy(old)
    assert migrated['admin_presentations']=={}
    from custom_components.family_access_manager.policy import Principal
    assert not Policy(migrated).presentation_managed(Principal('admin',is_admin=True))
    with pytest.raises(InvalidPolicy):validate_policy(old)


async def test_admin_display_changes_live_navigation_but_not_native_access(runtime,hass,hass_admin_user,hass_ws_client,panels):
    other=await hass.auth.async_create_user('Other admin',group_ids=[GROUP_ID_ADMIN])
    config=deepcopy(runtime.policy.config)
    config['roles']['family']['dashboards']={'dashboard-kids':'view'}
    config['admin_presentations'][hass_admin_user.id]='family'
    saved=await runtime.dispatch(hass_admin_user,'save_policy',config)
    assert saved['policy']['admin_presentations']=={hass_admin_user.id:'family'}
    ws=await hass_ws_client(hass)
    shown=await ws_result(ws,1,'get_panels')
    assert 'dashboard-kids' in shown and 'dashboard-private' not in shown
    assert PANEL_PATH in shown and 'history' in shown and 'calendar' in shown
    assert runtime.policy.dashboard(principal(hass_admin_user),'dashboard-private','edit')
    assert not runtime.policy.managed(principal(hass_admin_user))
    assert runtime.policy.presentation_managed(principal(hass_admin_user))
    assert not runtime.policy.presentation_managed(principal(other))
    assert hass_admin_user.is_admin
    assert (await runtime.dispatch(hass_admin_user,'admin_snapshot',{}))['policy']==saved['policy']
    # Native configuration access remains independent from navigation selection.
    assert await runtime.dispatch(hass_admin_user,'read_dashboard',{'url_path':'dashboard-private'}) is not None
    reload=type(runtime)(hass);await reload.load()
    assert reload.policy.config['admin_presentations']=={hass_admin_user.id:'family'}
    config=deepcopy(runtime.policy.config);config['roles']['family']['dashboards']={'dashboard-private':'view'}
    await runtime.dispatch(hass_admin_user,'save_policy',config)
    shown=await ws_result(ws,2,'get_panels')
    assert 'dashboard-private' in shown and 'dashboard-kids' not in shown and PANEL_PATH in shown
    config=deepcopy(runtime.policy.config);config['admin_presentations']={}
    await runtime.dispatch(hass_admin_user,'save_policy',config)
    assert await ws_result(ws,3,'get_panels')==panels


async def test_admin_profile_picker_includes_selected_admin_dashboards(runtime,hass,hass_admin_user,hass_ws_client):
    hass.data[LOVELACE_DATA].dashboards['dashboard-admin']=SimpleNamespace(config={'url_path':'dashboard-admin','title':'Admin','require_admin':True})
    config=deepcopy(runtime.policy.config);config['roles']['family']['dashboards']={'dashboard-admin':'view'}
    config['admin_presentations'][hass_admin_user.id]='family'
    await runtime.dispatch(hass_admin_user,'save_policy',config)
    ws=await hass_ws_client(hass)
    assert [d['url_path'] for d in await ws_result(ws,1,'lovelace/dashboards/list')]==['dashboard-admin']
    assert runtime.policy.dashboard(principal(hass_admin_user),'dashboard-kids','edit')


async def test_normal_account_cannot_receive_admin_display_and_inactive_reference_is_cleaned(runtime,child,hass_admin_user):
    config=deepcopy(runtime.policy.config);config['admin_presentations'][child[0].id]='family'
    with pytest.raises(InvalidPolicy):await runtime.dispatch(hass_admin_user,'save_policy',config)
    runtime.policy=Policy(config)
    saved=await runtime.dispatch(hass_admin_user,'save_policy',deepcopy(config))
    assert saved['policy']['admin_presentations']=={}


async def test_admin_order_application_preserves_native_privileges_and_preferences(runtime,hass,hass_admin_user):
    config=deepcopy(runtime.policy.config);config['roles']['family']['dashboards']={'dashboard-kids':'view','dashboard-private':'view'}
    config['roles']['family']['dashboard_order']=['dashboard-private','dashboard-kids'];config['admin_presentations'][hass_admin_user.id]='family'
    await runtime.dispatch(hass_admin_user,'save_policy',config)
    store=await async_user_store(hass,hass_admin_user.id)
    await store.async_set_item('core',{'default_panel':'dashboard-kids'})
    result=await runtime.dispatch(hass_admin_user,'apply_dashboard_order',{'role_id':'family','user_ids':[hass_admin_user.id],'revision':runtime.policy.config['revision']})
    assert result['applied']==[hass_admin_user.id]
    assert store.data['sidebar']['panelOrder']==['dashboard-private','dashboard-kids']
    assert store.data['core']['default_panel']=='dashboard-kids' and hass_admin_user.is_admin
