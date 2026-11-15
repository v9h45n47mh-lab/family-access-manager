"""Central roles, exact migration, withdrawal and authenticated app protocol."""
from copy import deepcopy
from unittest.mock import patch

import pytest
from homeassistant.auth.const import GROUP_ID_USER
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.family_access_manager.applications import APPLICATIONS, APPLICATION_CLIENTS, APPLICATION_EVENT
from custom_components.family_access_manager.client import allows, permissions, register, require
from custom_components.family_access_manager.const import DOMAIN
from custom_components.family_access_manager.policy import InvalidPolicy, Policy, default_policy, migrate_policy, validate_policy
from custom_components.family_access_manager.runtime import AccessDenied


def test_existing_policy_migrates_without_changing_dashboard_access():
    c=default_policy()
    del c['imported_applications']
    del c['roles']['family']['applications']
    c['roles']['family']['dashboards']={'dashboard-paul':'view'}
    original=deepcopy(c)
    migrated=migrate_policy(c)
    assert c==original
    assert migrated['roles']['family']['dashboards']==c['roles']['family']['dashboards']
    assert migrated['roles']['family']['applications']=={}
    assert migrated['imported_applications']==[]
    with pytest.raises(InvalidPolicy):validate_policy(c)


@pytest.mark.parametrize('grants',[{'essensplaner':{'delete_others':'true'}},{'unknown':{}},{'essensplaner':{'unknown':True}},{'essensplaner':True}])
def test_application_grants_are_strict(grants):
    c=default_policy();c['roles']['family']['applications']=grants
    with pytest.raises(InvalidPolicy):validate_policy(c)


async def test_role_caps_apply_without_enabling_dashboard_filter(runtime,child,grant,hass_admin_user):
    c=deepcopy(grant);c['enabled_users']=[]
    c['roles']['family']['applications']={'essensplaner':{'view':True,'delete_others':True}}
    runtime.policy=Policy(c)
    assert allows(runtime.hass,child[0],'essensplaner','delete_others')
    assert not allows(runtime.hass,child[0],'essensplaner','manage_catalog',True)
    assert not runtime.policy.managed(__import__('custom_components.family_access_manager.gate',fromlist=['principal']).principal(child[0]))
    assert child[0].is_admin is False
    assert allows(runtime.hass,hass_admin_user,'light_manager','manage')


async def test_legacy_app_rights_import_once_and_keep_dashboard_bindings(runtime,hass,child,grant):
    old=deepcopy(runtime.policy.config)
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'view':True,'plan':True,'delete_others':False})
    new=runtime.policy.config
    assert new['enabled_users']==old['enabled_users']
    assert new['bindings'][child[0].id][0]=='family'
    assert new['roles']['family']==old['roles']['family']
    assert allows(hass,child[0],'essensplaner','plan')
    assert not allows(hass,child[0],'essensplaner','delete_others',True)
    revision=new['revision']
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'delete_others':True})
    assert runtime.policy.config['revision']==revision
    assert not allows(hass,child[0],'essensplaner','delete_others',True)


async def test_explicit_role_denial_is_not_replaced_by_legacy_import(runtime,hass,child,grant):
    c=deepcopy(grant);c['roles']['family']['applications']={'essensplaner':{}}
    runtime.policy=Policy(c)
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'view':True,'delete_others':True})
    assert not allows(hass,child[0],'essensplaner','delete_others',True)
    assert runtime.policy.config['bindings'][child[0].id]==['family']


async def test_new_accounts_get_no_migrated_grants(runtime,hass,child):
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'view':True,'plan':True})
    user=await hass.auth.async_create_user('New',group_ids=[GROUP_ID_USER])
    assert not allows(hass,user,'essensplaner','plan',True)
    assert runtime.policy.config['enabled_users']==[]


async def test_import_failure_never_publishes_partial_policy(runtime,hass,child):
    before=deepcopy(runtime.policy.config)
    with patch.object(runtime.store,'async_save',side_effect=OSError('disk')):
        with pytest.raises(OSError):await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'plan':True})
    assert runtime.policy.config==before


async def test_role_revocation_rechecks_existing_app_subscription(runtime,hass,child,hass_admin_user,hass_ws_client):
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'view':True,'plan':True})
    ws=await hass_ws_client(hass,access_token=child[1])
    await ws.send_json({'id':1,'type':'family_access/subscribe','application':'essensplaner'})
    event=await ws.receive_json();assert event['event']['permissions']['plan'] is True
    assert (await ws.receive_json())['success']
    candidate=deepcopy(runtime.policy.config)
    candidate['bindings'][child[0].id]=[]
    await runtime.dispatch(hass_admin_user,'save_policy',candidate)
    event=await ws.receive_json();assert event['event']['permissions']['plan'] is False
    assert not allows(hass,child[0],'essensplaner','plan',True)
    with pytest.raises(PermissionError):require(hass,child[0],'essensplaner','delete_others',True)
    assert runtime.error_log.snapshot()[0]['operation']=='essensplaner/delete_others'


async def test_client_fails_closed_after_provider_unload(runtime,hass,child):
    entry=MockConfigEntry(domain=DOMAIN);entry.add_to_hass(hass)
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'delete_others':True})
    hass.data.pop(DOMAIN)
    try:assert not allows(hass,child[0],'essensplaner','delete_others',True)
    finally:hass.data[DOMAIN]=runtime


async def test_own_permissions_cannot_be_requested_for_another_user(runtime,hass,child,hass_ws_client):
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'view':True})
    ws=await hass_ws_client(hass,access_token=child[1])
    await ws.send_json({'id':1,'type':'family_access/application_permissions','application':'essensplaner','user_id':'owner'})
    result=await ws.receive_json();assert not result['success']
    with pytest.raises(AccessDenied):await runtime.dispatch(child[0],'save_policy',runtime.policy.config)


async def test_multiple_roles_add_grants_and_ha_admin_identity_is_not_modified(runtime,hass,child,grant):
    c=deepcopy(grant)
    c['roles']['family']['applications']={'essensplaner':{'view':True}}
    c['roles']['editor']=deepcopy(c['roles']['family']);c['roles']['editor']['applications']={'essensplaner':{'delete_others':True}}
    c['bindings'][child[0].id].append('editor');runtime.policy=Policy(c)
    assert permissions(hass,child[0],'essensplaner')['delete_others'] is True
    assert child[0].is_admin is False and child[0].is_owner is False


@pytest.mark.parametrize('application',APPLICATIONS)
async def test_every_application_uses_real_authenticated_role_checks(runtime,hass,child,hass_admin_user,application):
    keys=APPLICATIONS[application]['permissions']
    await register(hass,application,keys,lambda u:{key:True for key in keys})
    for key in keys:assert allows(hass,child[0],application,key)
    candidate=deepcopy(runtime.policy.config)
    candidate['bindings'][child[0].id]=[]
    await runtime.dispatch(hass_admin_user,'save_policy',candidate)
    for key in keys:assert not allows(hass,child[0],application,key,True)
    assert not child[0].is_admin
