"""The native profile picker uses a separate Lovelace dashboard list."""
from copy import deepcopy
import json
from types import SimpleNamespace

import pytest
from homeassistant.components import websocket_api
from homeassistant.components.lovelace.const import LOVELACE_DATA

from custom_components.family_access_manager.policy import InvalidPolicy, Policy, Principal, default_policy
from custom_components.family_access_manager.sidebar import DashboardListFilter, _DashboardConnection, visible_dashboards


def config():
    c = default_policy()
    c['bindings'] = {'paul':['family']}
    c['enabled_users'] = ['paul']
    c['roles']['family']['dashboards'] = {'dashboard-paul':'view', 'dashboard-admin':'view'}
    return c


def dashboards():
    return [
        {'url_path':'dashboard-paul','title':'Paul','icon':'mdi:home'},
        {'url_path':'dashboard-vera','title':'Vera'},
        {'url_path':'dashboard-admin','title':'Admin','require_admin':True},
        {'url_path':'family-access-manager','title':'Family Access'},
    ]


def test_profile_list_returns_only_granted_nonadmin_dashboards_without_mutation():
    raw = dashboards()
    before = deepcopy(raw)
    assert visible_dashboards(Policy(config()), Principal('paul'), raw) == [raw[0]]
    assert raw == before


@pytest.mark.parametrize('user',[Principal('manuel',is_admin=True),Principal('owner',is_owner=True),Principal('unmanaged')])
def test_other_accounts_keep_native_catalog(user):
    raw = dashboards()
    assert visible_dashboards(Policy(config()), user, raw) is raw


@pytest.mark.parametrize('encoding',['dict','str','bytes','send_result'])
def test_catalog_proxy_preserves_response_formats_and_identity(encoding):
    messages=[]
    connection=SimpleNamespace(user=Principal('paul'),send_message=messages.append,send_result=lambda mid,result:messages.append({'id':mid,'result':result}))
    proxy=_DashboardConnection(connection,SimpleNamespace(policy=Policy(config())),4)
    message={'id':4,'type':'result','success':True,'result':dashboards()}
    if encoding=='send_result':
        proxy.send_result(4,dashboards())
    else:
        data=message if encoding=='dict' else json.dumps(message)
        proxy.send_message(data.encode() if encoding=='bytes' else data)
    assert messages[0]['result']==[dashboards()[0]]
    assert connection.user.id=='paul'


def test_uninstall_restores_only_owned_dashboard_handler():
    original=(lambda *args: None, object())
    registry={'lovelace/dashboards/list':original}
    wrapper=DashboardListFilter(SimpleNamespace(policy=Policy(config())))
    assert wrapper.install(registry)
    assert registry['lovelace/dashboards/list'][1] is original[1]
    wrapper.uninstall()
    assert registry['lovelace/dashboards/list'] is original
    assert wrapper.install(registry)
    replacement=(lambda *args: None,object())
    registry['lovelace/dashboards/list']=replacement
    wrapper.uninstall()
    assert registry['lovelace/dashboards/list'] is replacement


async def fetch(ws,mid):
    await ws.send_json({'id':mid,'type':'lovelace/dashboards/list'})
    result=await ws.receive_json()
    assert result['success'],result
    return result['result']


async def test_real_profile_list_filters_only_activated_account_and_rechecks_each_request(runtime,hass,child,grant,hass_ws_client,hass_admin_user):
    data=hass.data[LOVELACE_DATA].dashboards
    data['dashboard-admin']=SimpleNamespace(config={'url_path':'dashboard-admin','title':'Admin','require_admin':True})
    current=deepcopy(grant)
    current['roles']['family']['dashboards']['dashboard-admin']='view'
    runtime.policy=Policy(current)
    selected=await hass_ws_client(hass,access_token=child[1])
    assert [d['url_path'] for d in await fetch(selected,1)]==['dashboard-kids']
    admin=await hass_ws_client(hass)
    assert {d['url_path'] for d in await fetch(admin,1)}==set(data)
    changed=deepcopy(runtime.policy.config)
    changed['roles']['family']['dashboards']={'dashboard-private':'view'}
    await runtime.dispatch(hass_admin_user,'save_policy',changed)
    assert [d['url_path'] for d in await fetch(selected,2)]==['dashboard-private']
    changed=deepcopy(runtime.policy.config)
    changed['enabled_users']=[]
    await runtime.dispatch(hass_admin_user,'save_policy',changed)
    assert {d['url_path'] for d in await fetch(selected,3)}==set(data)
    assert data['dashboard-admin'].config['require_admin'] is True


async def test_active_user_without_grants_has_no_dashboard_options(runtime,hass,child,grant,hass_ws_client):
    c=deepcopy(grant)
    c['bindings'][child[0].id]=[]
    runtime.policy=Policy(c)
    ws=await hass_ws_client(hass,access_token=child[1])
    assert await fetch(ws,1)==[]


async def test_cannot_enable_filtering_without_native_profile_catalog_handler(runtime,child,grant,hass_admin_user):
    runtime.dashboard_list.uninstall()
    with pytest.raises(InvalidPolicy,match='Dashboardauswahl im Profil'):
        await runtime.dispatch(hass_admin_user,'save_policy',deepcopy(grant))
