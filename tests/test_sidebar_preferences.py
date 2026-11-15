"""Real native frontend stores: live updates, isolation and authorization."""
from copy import deepcopy
from unittest.mock import patch

import pytest
from homeassistant.auth.const import GROUP_ID_ADMIN, GROUP_ID_USER
from homeassistant.components.frontend import storage

from custom_components.family_access_manager.gate import principal
from custom_components.family_access_manager.policy import InvalidPolicy, Policy, default_policy, migrate_policy, validate_policy
from custom_components.family_access_manager.runtime import AccessDenied, Conflict
from custom_components.family_access_manager.sidebar_preferences import fingerprint, merge_order


def test_legacy_roles_migrate_without_changing_grants():
    config = default_policy()
    del config['roles']['family']['dashboard_order']
    config['roles']['family']['dashboards'] = {'dashboard-kids': 'edit'}
    before = deepcopy(config)
    migrated = migrate_policy(config)
    assert config == before
    assert migrated['roles']['family']['dashboard_order'] == []
    assert migrated['roles']['family']['dashboards'] == before['roles']['family']['dashboards']
    with pytest.raises(InvalidPolicy):
        validate_policy(config)


@pytest.mark.parametrize('order', [True, {}, ['../bad'], ['kids', 'kids'], [False], ['x'] * 3001])
def test_order_validation(order):
    config = default_policy()
    config['roles']['family']['dashboard_order'] = order
    with pytest.raises(InvalidPolicy):
        validate_policy(config)


def test_order_preserves_other_panel_relative_positions():
    assert merge_order(['history', 'b', 'config', 'a', 'media-browser'], ['a', 'b', 'c'], {'a','b','c'}) == ['history','a','config','b','c','media-browser']
    assert merge_order(['history'], ['b','a'], {'a','b'}) == ['b','a','history']


async def apply(runtime, admin, users, **updates):
    payload = {'role_id': 'family', 'user_ids': users, 'revision': runtime.policy.config['revision']}
    payload.update(updates)
    return await runtime.dispatch(admin, 'apply_dashboard_order', payload)


async def test_order_uses_live_native_store_and_survives_reload(runtime, hass, child, grant, hass_admin_user):
    config = deepcopy(grant)
    config['roles']['family']['dashboard_order'] = ['dashboard-private', 'deleted', 'dashboard-kids']
    config['roles']['family']['dashboards']['dashboard-private'] = 'view'
    runtime.policy = Policy(config)
    store = await storage.async_user_store(hass, child[0].id)
    original = {'panelOrder': ['history','dashboard-kids','media-browser'], 'hiddenPanels': ['history'], 'extra': 42}
    await store.async_set_item('sidebar', original)
    await store.async_set_item('language', 'de')
    await store.async_set_item('default_panel', 'dashboard-kids')
    updates = []
    unsubscribe = store.async_subscribe('sidebar', lambda: updates.append(deepcopy(store.data['sidebar'])))
    policy_before = deepcopy(runtime.policy.config)
    result = await apply(runtime, hass_admin_user, [child[0].id])
    assert result == {'applied': [child[0].id], 'failed': []}
    assert updates[-1] == {'panelOrder': ['history','dashboard-private','dashboard-kids','media-browser'], 'hiddenPanels':['history'], 'extra':42}
    assert store.data['default_panel'] == 'dashboard-kids' and store.data['language'] == 'de'
    assert runtime.policy.config == policy_before
    reloaded = storage.UserStore(hass, child[0].id)
    await reloaded.async_load()
    assert reloaded.data == store.data
    unsubscribe()


async def test_admin_visibility_is_per_user_keeps_rights_and_updates_native_subscription(runtime, hass, hass_admin_user):
    other = await hass.auth.async_create_user('Other admin', group_ids=[GROUP_ID_ADMIN])
    store = await storage.async_user_store(hass, hass_admin_user.id)
    await store.async_set_item('sidebar', {'panelOrder':['history','dashboard-kids'], 'hiddenPanels':['history'], 'extra':'preserve'})
    await store.async_set_item('language', 'de')
    snapshot = await runtime.dispatch(hass_admin_user, 'admin_sidebar', {'user_id': hass_admin_user.id})
    assert 'language' not in snapshot and 'panelOrder' not in snapshot
    changes = []
    unsub = store.async_subscribe('sidebar', lambda: changes.append(True))
    before = deepcopy(runtime.policy.config)
    result = await runtime.dispatch(hass_admin_user, 'save_admin_sidebar', {
        'user_id': hass_admin_user.id, 'token':snapshot['token'],
        'visible_dashboards':['dashboard-kids'], 'default_panel':'dashboard-kids'})
    assert result['visible_dashboards'] == ['dashboard-kids']
    assert store.data['sidebar']['hiddenPanels'] == ['history','dashboard-private']
    assert store.data['language'] == 'de' and store.data['sidebar']['extra'] == 'preserve'
    assert store.data['default_panel'] == 'dashboard-kids' and changes == [True]
    assert runtime.policy.dashboard(principal(hass_admin_user), 'dashboard-private', 'edit')
    assert runtime.policy.config == before
    untouched = await storage.async_user_store(hass, other.id)
    assert untouched.data == {}
    unsub()


async def test_admin_save_detects_stale_native_preferences(runtime, hass, hass_admin_user):
    snap = await runtime.dispatch(hass_admin_user, 'admin_sidebar', {'user_id':hass_admin_user.id})
    store = await storage.async_user_store(hass, hass_admin_user.id)
    await store.async_set_item('sidebar', {'hiddenPanels':['history']})
    with pytest.raises(Conflict):
        await runtime.dispatch(hass_admin_user, 'save_admin_sidebar', {'user_id':hass_admin_user.id, 'token':snap['token'], 'visible_dashboards':[], 'default_panel':'profile'})
    assert store.data['sidebar']['hiddenPanels'] == ['history']


async def test_hidden_start_page_requires_explicit_visible_replacement(runtime, hass_admin_user):
    snap = await runtime.dispatch(hass_admin_user, 'admin_sidebar', {'user_id':hass_admin_user.id})
    payload = {'user_id':hass_admin_user.id, 'token':snap['token'], 'visible_dashboards':[], 'default_panel':'dashboard-kids'}
    with pytest.raises(ValueError, match='Startseite'):
        await runtime.dispatch(hass_admin_user, 'save_admin_sidebar', payload)
    payload['default_panel'] = 'profile'
    result = await runtime.dispatch(hass_admin_user, 'save_admin_sidebar', payload)
    assert result['visible_dashboards'] == [] and result['default_panel'] == 'profile'


@pytest.mark.parametrize('action,payload', [
    ('admin_sidebar', {'user_id':'anything'}),
    ('save_admin_sidebar', {'user_id':'anything'}),
    ('apply_dashboard_order', {'role_id':'family','user_ids':[],'revision':0})])
async def test_child_cannot_edit_any_sidebar_http_ws(runtime, hass, child, hass_client, hass_ws_client, action, payload):
    client = await hass_client(child[1])
    response = await client.post('/api/family_access_manager/request', json={'action':action,'payload':payload})
    assert response.status == 403
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({'id':1,'type':'family_access_manager/request','action':action,'payload':payload})
    result = await ws.receive_json()
    assert not result['success'] and result['error']['code'] == 'unauthorized'


async def test_invalid_targets_and_revisions_do_not_write(runtime, child, hass_admin_user):
    for targets in ([], ['missing'], [child[0].id,child[0].id], [False]):
        with pytest.raises(ValueError):
            await apply(runtime, hass_admin_user, targets)
    with pytest.raises(Conflict):
        await apply(runtime, hass_admin_user, [child[0].id], revision=99)
    with pytest.raises(ValueError):
        await runtime.dispatch(hass_admin_user, 'admin_sidebar', {'user_id':child[0].id})


async def test_partial_order_failure_is_reported_and_logged_without_secrets(runtime, hass, child, grant, hass_admin_user):
    other = await hass.auth.async_create_user('Other', group_ids=[GROUP_ID_USER])
    from custom_components.family_access_manager.sidebar_preferences import apply_order
    async def failing(hass, uid, *args):
        if uid == child[0].id:
            raise OSError('secret token hidden')
        return await apply_order(hass, uid, *args)
    with patch('custom_components.family_access_manager.runtime.apply_order', side_effect=failing):
        result = await apply(runtime, hass_admin_user, [child[0].id, other.id])
    assert result == {'applied':[other.id], 'failed':[child[0].id]}
    assert 'secret' not in str(runtime.error_log.snapshot())
    assert runtime.error_log.snapshot()[0]['target'] == child[0].id


async def test_failed_native_write_restores_memory_and_previous_preferences(runtime, hass, hass_admin_user):
    store = await storage.async_user_store(hass, hass_admin_user.id)
    await store.async_set_item('sidebar', {'panelOrder':['history'], 'hiddenPanels':[]})
    await store.async_set_item('default_panel', 'home')
    original = deepcopy(store.data)
    snap = await runtime.dispatch(hass_admin_user, 'admin_sidebar', {'user_id':hass_admin_user.id})
    with patch.object(store._store, 'async_save', side_effect=[None, OSError('disk'), None, None]):
        with pytest.raises(OSError):
            await runtime.dispatch(hass_admin_user,'save_admin_sidebar',{'user_id':hass_admin_user.id,'token':snap['token'],'visible_dashboards':[],'default_panel':'profile'})
    assert store.data == original


async def test_real_native_websocket_subscription_receives_applied_order(runtime, hass, child, grant, hass_admin_user, hass_ws_client):
    await storage.async_setup_frontend_storage(hass)
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({'id':1,'type':'frontend/subscribe_user_data','key':'sidebar'})
    initial, result = await ws.receive_json(), await ws.receive_json()
    assert initial['type'] == 'event' and result['success']
    await apply(runtime, hass_admin_user, [child[0].id])
    event = await ws.receive_json()
    assert event['event']['value']['panelOrder'] == ['dashboard-kids']


async def test_only_chosen_dashboards_change_their_native_order(runtime, hass, child, grant, hass_admin_user):
    store = await storage.async_user_store(hass, child[0].id)
    await store.async_set_item('sidebar', {'panelOrder':['history','dashboard-private','dashboard-kids','media-browser']})
    role = runtime.policy.config['roles']['family']
    role['dashboard_order'] = ['dashboard-private','dashboard-kids']
    result = await apply(runtime,hass_admin_user,[child[0].id])
    assert result['applied'] == [child[0].id]
    assert store.data['sidebar']['panelOrder'] == ['history','dashboard-private','dashboard-kids','media-browser']


async def test_unchanged_legacy_admin_and_deleted_bindings_do_not_block_save_and_order(runtime, hass, child, grant, hass_admin_user):
    stale = deepcopy(grant)
    stale['bindings'][hass_admin_user.id] = ['family']
    stale['bindings']['deleted-user'] = []
    stale['enabled_users'] += [hass_admin_user.id, 'deleted-user']
    runtime.policy = Policy(stale)
    candidate = deepcopy(stale)
    candidate['roles']['family']['dashboard_order'] = ['dashboard-kids']
    saved = await runtime.dispatch(hass_admin_user, 'save_policy', candidate)
    assert saved['policy']['bindings'] == {child[0].id:['family']}
    assert saved['policy']['enabled_users'] == [child[0].id]
    assert candidate['bindings'] == stale['bindings'], 'Do not mutate caller drafts'
    assert (await apply(runtime,hass_admin_user,[child[0].id]))['applied'] == [child[0].id]
    # A second save of the returned canonical policy works too.
    await runtime.dispatch(hass_admin_user, 'save_policy', saved['policy'])


async def test_new_changes_to_legacy_admin_bindings_still_fail(runtime, grant, hass_admin_user):
    stale = deepcopy(grant)
    stale['bindings'][hass_admin_user.id] = ['family']
    runtime.policy = Policy(stale)
    candidate = deepcopy(stale)
    candidate['enabled_users'].append(hass_admin_user.id)
    with pytest.raises(InvalidPolicy):
        await runtime.dispatch(hass_admin_user,'save_policy',candidate)


async def test_empty_role_order_cannot_be_applied(runtime, child, hass_admin_user):
    with pytest.raises(ValueError, match='keine Dashboards'):
        await apply(runtime,hass_admin_user,[child[0].id])
