"""Run the shipped NFC authorization against actual central grants."""
import ast
from copy import deepcopy
import importlib.util
import os
from pathlib import Path

import pytest


async def test_shipped_dishwasher_confirms_without_history_and_checks_identity(runtime, hass, child, grant, hass_admin_user):
    consumers = Path(os.environ.get('APPLICATION_CONSUMER_ROOT', Path(__file__).resolve().parents[2]))
    component = consumers / 'spuelmaschine-verlauf/custom_components/spuelmaschine_verlauf'
    assert component.is_dir(), 'Pinned dishwasher consumer must be checked out for this regression'
    spec = importlib.util.spec_from_file_location('actual_duty_client', component / 'family_access.py')
    client = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(client)
    module = ast.parse((component / '__init__.py').read_text())
    helper = next(n for n in module.body if isinstance(n, ast.AsyncFunctionDef) and n.name == 'authorize_empty')
    namespace = {'allows': client.allows, 'DOMAIN': 'spuelmaschine_verlauf',
                 'PEOPLE': {'Paul', 'Maximilian', 'Vera', 'Manuel'}, 'ServiceValidationError': ValueError}
    exec(compile(ast.Module(body=[helper], type_ignores=[]), '<shipped dishwasher authorization>', 'exec'), namespace)
    config = deepcopy(runtime.policy.config)
    config['app_roles']['user']['applications'] = {
        'spuelmaschine_verlauf': {'confirm_own': True, 'view': False, 'statistics': False}}
    config['app_bindings'][child[0].id] = ['user']
    await runtime.dispatch(hass_admin_user, 'save_policy', config)
    authorize = namespace['authorize_empty']
    assert await authorize(hass, child[0].id, None, 'Paul') is False, 'Allowed, with no override of the assigned duty'
    assert not client.allows(hass, child[0], 'spuelmaschine_verlauf', 'view')
    assert not client.allows(hass, child[0], 'spuelmaschine_verlauf', 'statistics')
    with pytest.raises(ValueError):
        await authorize(hass, child[0].id, None, 'Maximilian')
    config = deepcopy(runtime.policy.config)
    config['app_roles']['user']['applications']['spuelmaschine_verlauf']['confirm_own'] = False
    await runtime.dispatch(hass_admin_user, 'save_policy', config)
    with pytest.raises(ValueError):
        await authorize(hass, child[0].id, None, 'Paul')
