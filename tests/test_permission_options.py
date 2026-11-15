"""Independent duty confirmation and the combined own-alarm grant."""
from copy import deepcopy

import pytest

from custom_components.family_access_manager.client import allows
from custom_components.family_access_manager.policy import Policy, Principal, default_policy, migrate_policy


def configured(application, grants):
    value = default_policy()
    value['app_roles']['user']['applications'] = {application: grants}
    value['app_bindings']['child'] = ['user']
    return value


def test_own_dishwasher_confirmation_needs_no_history_or_statistics():
    policy = Policy(configured('spuelmaschine_verlauf', {'confirm_own': True, 'view': False, 'statistics': False}))
    grants = policy.application_permissions(Principal('child'), 'spuelmaschine_verlauf')
    assert grants['confirm_own']
    assert not grants['view'] and not grants['statistics'] and not grants['confirm_any']


@pytest.mark.parametrize('old', [
    {'view': False, 'use_own': True}, {'view': True, 'use_own': False},
    {'view': True}, {'manage': True}, {},
])
def test_alarm_view_alias_follows_management_without_promoting_old_read_only(old):
    config = configured('wecker_manager', old)
    before = deepcopy(config)
    expected = bool(old.get('use_own') or old.get('manage'))
    for normalized in [Policy(config).config, migrate_policy(config)]:
        grants = normalized['app_roles']['user']['applications']['wecker_manager']
        assert grants['view'] is expected and grants['use_own'] is expected
    assert config == before


async def test_actual_protocol_reads_and_writes_share_own_alarm_grant(runtime, hass, child, grant, hass_admin_user):
    config = deepcopy(runtime.policy.config)
    config['app_roles']['user']['applications'] = {
        'spuelmaschine_verlauf': {'confirm_own': True, 'view': False, 'statistics': False},
        'wecker_manager': {'use_own': True, 'view': False},
    }
    config['app_bindings'][child[0].id] = ['user']
    await runtime.dispatch(hass_admin_user, 'save_policy', config)
    assert allows(hass, child[0], 'spuelmaschine_verlauf', 'confirm_own')
    assert not allows(hass, child[0], 'spuelmaschine_verlauf', 'view')
    assert not allows(hass, child[0], 'spuelmaschine_verlauf', 'statistics')
    assert allows(hass, child[0], 'wecker_manager', 'view')
    assert allows(hass, child[0], 'wecker_manager', 'use_own')
    next_config = deepcopy(runtime.policy.config)
    next_config['app_roles']['user']['applications']['wecker_manager'] = {'use_own': False, 'view': True}
    await runtime.dispatch(hass_admin_user, 'save_policy', next_config)
    assert not allows(hass, child[0], 'wecker_manager', 'view')
    assert not allows(hass, child[0], 'wecker_manager', 'use_own')
    assert not child[0].is_admin
