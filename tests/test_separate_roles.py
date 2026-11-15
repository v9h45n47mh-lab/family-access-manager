"""Display profiles cannot grant app rights; app roles cannot grant dashboards."""
from copy import deepcopy
from unittest.mock import patch

import pytest
from homeassistant.auth.const import GROUP_ID_USER

from custom_components.family_access_manager.applications import APPLICATIONS
from custom_components.family_access_manager.client import allows, register
from custom_components.family_access_manager.gate import principal
from custom_components.family_access_manager.policy import InvalidPolicy, Policy, Principal, _legacy_default_policy, default_policy, migrate_policy, validate_policy


def legacy_policy():
    c=_legacy_default_policy()
    c['roles']['family']['applications']={'essensplaner':{'view':True,'plan':True,'delete_others':False},'light_manager':{}}
    c['roles']['family']['dashboards']={'dashboard-max':'view'}
    c['roles']['paul']={**deepcopy(c['roles']['family']),'name':'Paul','dashboards':{'dashboard-paul':'view'}}
    c['roles']['extra']={**deepcopy(c['roles']['family']),'name':'Extra','applications':{'wecker_manager':{'view':True,'use_own':True}},'dashboards':{}}
    c['bindings']={'max':['family','extra'],'paul':['paul','extra'],'disabled':['paul']}
    c['enabled_users']=['max','paul']
    return c


def test_split_preserves_effective_grants_and_reuses_same_app_role():
    old=legacy_policy();before=deepcopy(old);c=migrate_policy(old);p=Policy(c)
    assert old==before
    assert c['app_bindings']['max']==c['app_bindings']['paul']
    for uid,path in [('max','dashboard-max'),('paul','dashboard-paul')]:
        assert p.dashboard(Principal(uid),path)
        assert not p.dashboard(Principal(uid),'dashboard-paul' if uid=='max' else 'dashboard-max')
        assert p.application_permissions(Principal(uid),'essensplaner')['plan']
        assert not p.application_permissions(Principal(uid),'essensplaner')['delete_others']
        assert p.application_permissions(Principal(uid),'wecker_manager')['use_own']
    assert not p.managed(Principal('disabled'))
    assert p.application_permissions(Principal('disabled'),'essensplaner')['plan']
    assert not any(role['applications'] for role in c['roles'].values())
    assert migrate_policy(c)==c
    with pytest.raises(InvalidPolicy):validate_policy(old)


def test_user_and_admin_app_presets_do_not_change_native_admin_or_display_access():
    c=default_policy();c['bindings']={'max':['family'],'paul':[]};c['enabled_users']=['max','paul'];c['app_bindings']={'max':['user'],'paul':['user']}
    c['roles']['family']['dashboards']={'dashboard-max':'view'}
    p=Policy(c)
    for app in APPLICATIONS:
        assert p.application_permissions(Principal('max'),app)==p.application_permissions(Principal('paul'),app)
    c['bindings']['max']=[]
    assert Policy(c).application_permissions(Principal('max'),'essensplaner')['plan']
    c['app_bindings']['paul']=['admin'];p=Policy(c)
    assert all(p.application_permissions(Principal('paul'),'essensplaner').values())
    assert not p.privileged(Principal('paul')) and not p.dashboard(Principal('paul'),'dashboard-admin')
    assert not p.application_permissions(Principal('inactive',is_active=False),'essensplaner')


@pytest.mark.parametrize('change',[
    lambda c:c['roles']['family']['applications'].update({'essensplaner':{'plan':True}}),
    lambda c:c['app_roles']['user'].update(dashboards={'dashboard-admin':'view'}),
    lambda c:c['app_roles']['user']['applications']['essensplaner'].update(plan='true'),
    lambda c:c['app_bindings'].update(paul=['missing']),
    lambda c:c['app_bindings'].update(paul=['user','user']),
    lambda c:c.pop('app_roles'),
])
def test_mixed_or_ambiguous_writes_are_rejected(change):
    c=default_policy();change(c)
    with pytest.raises(InvalidPolicy):validate_policy(c)


async def test_storage_migration_is_atomic_and_durable(runtime):
    old=legacy_policy()
    with patch.object(runtime.store,'async_load',return_value=old),patch.object(runtime.store,'async_save') as save:
        await runtime.load();save.assert_awaited_once_with(runtime.policy.config)
    before=deepcopy(runtime.policy.config)
    with patch.object(runtime.store,'async_load',return_value=old),patch.object(runtime.store,'async_save',side_effect=OSError('disk')):
        with pytest.raises(OSError):await runtime.load()
    assert runtime.policy.config==before


async def test_shared_app_role_updates_both_real_users_without_changing_displays(runtime,hass,child,grant,hass_admin_user):
    max_user=await hass.auth.async_create_user('Maximilian',group_ids=[GROUP_ID_USER])
    c=deepcopy(grant);c['roles']['max']={**deepcopy(c['roles']['family']),'name':'Maximilian','dashboards':{'dashboard-private':'view'}}
    c['bindings'][max_user.id]=['max'];c['enabled_users'].append(max_user.id)
    c['app_bindings']={child[0].id:['user'],max_user.id:['user']};runtime.policy=Policy(c)
    await register(hass,'essensplaner',APPLICATIONS['essensplaner']['permissions'],lambda u:{'delete_others':True})
    assert all(allows(hass,u,'essensplaner','plan') and not allows(hass,u,'essensplaner','delete_others') for u in [child[0],max_user])
    before=deepcopy(runtime.policy.config['bindings'])
    update=deepcopy(runtime.policy.config);update['app_roles']['user']['applications']['essensplaner']['plan']=False
    await runtime.dispatch(hass_admin_user,'save_policy',update)
    assert not any(allows(hass,u,'essensplaner','plan') for u in [child[0],max_user])
    assert runtime.policy.config['bindings']==before
    assert runtime.policy.dashboard(principal(child[0]),'dashboard-kids')
    assert runtime.policy.dashboard(principal(max_user),'dashboard-private')
    assert not runtime.policy.dashboard(principal(child[0]),'dashboard-private')
    assert not max_user.is_admin and not child[0].is_admin


async def test_migrated_explicit_denial_survives_late_import(runtime,hass,child):
    old=legacy_policy();old['bindings']={child[0].id:['family']};old['enabled_users']=[]
    runtime.policy=Policy(migrate_policy(old))
    await register(hass,'light_manager',APPLICATIONS['light_manager']['permissions'],lambda u:{'manage':True,'view':True})
    assert not allows(hass,child[0],'light_manager','manage')


async def test_app_binding_to_native_admin_is_rejected_and_unchanged_stale_binding_is_cleaned(runtime,hass_admin_user):
    candidate=deepcopy(runtime.policy.config)
    candidate['app_bindings'][hass_admin_user.id]=['user']
    with pytest.raises(InvalidPolicy):await runtime.dispatch(hass_admin_user,'save_policy',candidate)
    runtime.policy=Policy(candidate)
    saved=await runtime.dispatch(hass_admin_user,'save_policy',deepcopy(candidate))
    assert hass_admin_user.id not in saved['policy']['app_bindings']
    assert hass_admin_user.is_admin
