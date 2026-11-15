"""Per-user opt-in, storage migration and authorization regressions."""

from copy import deepcopy
from unittest.mock import patch

import pytest

from homeassistant.auth.const import GROUP_ID_USER

from custom_components.family_access_manager.policy import (
    InvalidPolicy, Policy, Principal, Resource, default_policy, migrate_policy, validate_policy,
)
from custom_components.family_access_manager.runtime import Runtime

URL = "/api/family_access_manager/request"


def configured():
    config = default_policy()
    config["bindings"] = {"test": ["family"], "other": []}
    config["roles"]["family"]["dashboards"] = {"dashboard-test": "view"}
    config["roles"]["family"]["entities"] = {"switch.probe": "control"}
    return config


def test_role_assignment_alone_does_not_activate_user():
    config = configured()
    user = Principal("test")
    disabled = Policy(config)
    assert not disabled.managed(user)
    assert disabled.roles(user) == []
    assert not disabled.dashboard(user, "dashboard-test")
    assert not disabled.entity(user, Resource("switch.probe"), "control")
    config["enabled_users"] = ["test"]
    enabled = Policy(config)
    assert enabled.managed(user)
    assert enabled.dashboard(user, "dashboard-test")
    assert enabled.entity(user, Resource("switch.probe"), "control")
    assert not enabled.managed(Principal("other"))


def test_disabling_keeps_assignments_and_reenabling_restores_grants():
    config = configured()
    config["enabled_users"] = ["test", "other"]
    original_bindings = deepcopy(config["bindings"])
    config["enabled_users"].remove("test")
    assert not Policy(config).managed(Principal("test"))
    assert Policy(config).managed(Principal("other"))
    assert not Policy(config).dashboard(Principal("other"), "dashboard-test")
    config["enabled_users"].append("test")
    assert config["bindings"] == original_bindings
    assert Policy(config).entity(Principal("test"), Resource("switch.probe"), "control")
    assert Policy(config).entity(Principal("admin", is_admin=True), Resource("switch.private"), "control")


@pytest.mark.parametrize("enabled", [True, "test", {}, [True], ["test", "test"], ["missing"]])
def test_activation_field_is_strict(enabled):
    config = configured()
    config["enabled_users"] = enabled
    with pytest.raises(InvalidPolicy):
        validate_policy(config)


def test_storage_migrates_all_existing_bindings_including_deny_all():
    legacy = configured()
    del legacy["enabled_users"]
    original = deepcopy(legacy)
    migrated = migrate_policy(legacy)
    assert migrated["enabled_users"] == ["test", "other"]
    assert migrated["bindings"] == legacy["bindings"]
    assert legacy == original
    assert Policy(migrated).managed(Principal("other"))
    # An old API client must reload instead of implicitly enabling users.
    with pytest.raises(InvalidPolicy):
        validate_policy(legacy)
    assert migrate_policy(configured())["enabled_users"] == []


async def test_runtime_migrates_storage_and_persists_disabled_selection(runtime):
    legacy = configured()
    del legacy["enabled_users"]
    with patch.object(runtime.store, "async_load", return_value=legacy), patch.object(runtime.store, "async_save") as save:
        await runtime.load()
        save.assert_awaited_once_with(runtime.policy.config)
    assert runtime.policy.config["enabled_users"] == ["test", "other"]
    disabled = deepcopy(runtime.policy.config)
    disabled["enabled_users"] = []
    with patch.object(runtime.store, "async_load", return_value=disabled), patch.object(runtime.store, "async_save") as save:
        await runtime.load()
        save.assert_not_awaited()
    assert runtime.policy.config["bindings"] == disabled["bindings"]
    assert not runtime.policy.managed(Principal("test"))


async def test_gate_switches_only_selected_user_on_existing_connection(runtime, hass, child, grant, hass_ws_client, hass_admin_user):
    other = await hass.auth.async_create_user("Other", group_ids=[GROUP_ID_USER])
    refresh = await hass.auth.async_create_refresh_token(other, client_id="https://example.com")
    other_token = hass.auth.async_create_access_token(refresh)
    candidate = deepcopy(grant)
    candidate["native_dashboard_gate"] = True
    candidate["bindings"][other.id] = ["family"]
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    selected = await hass_ws_client(hass, access_token=child[1])
    untouched = await hass_ws_client(hass, access_token=other_token)
    await selected.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert not (await selected.receive_json())["success"]
    await untouched.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert (await untouched.receive_json())["success"]
    candidate = deepcopy(runtime.policy.config)
    candidate["enabled_users"] = []
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    await selected.send_json({"id": 2, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert (await selected.receive_json())["success"]
    assert runtime.policy.config["bindings"][child[0].id] == ["family"]
    candidate = deepcopy(runtime.policy.config)
    candidate["enabled_users"] = [child[0].id]
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    await selected.send_json({"id": 3, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert not (await selected.receive_json())["success"]


async def test_disabled_user_cannot_activate_self_via_rest_or_websocket(runtime, hass, child, grant, hass_client, hass_ws_client):
    saved = deepcopy(grant)
    saved["enabled_users"] = []
    runtime.policy = Policy(saved)
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "status", "payload": {}})
    status = (await response.json())["result"]
    assert not status["managed"] and status["roles"] == []
    candidate = deepcopy(saved)
    candidate["enabled_users"] = [child[0].id]
    response = await client.post(URL, json={"action": "save_policy", "payload": candidate})
    assert response.status == 403
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "family_access_manager/request", "action": "save_policy", "payload": candidate})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unauthorized"
    assert runtime.policy.config == saved
    response = await client.post(URL, json={"action": "read_entity", "payload": {"entity_id": "switch.probe"}})
    assert response.status == 403


async def test_admin_cannot_be_added_to_activation(runtime, hass_admin_user):
    candidate = deepcopy(runtime.policy.config)
    candidate["bindings"][hass_admin_user.id] = ["family"]
    candidate["enabled_users"] = [hass_admin_user.id]
    with pytest.raises(InvalidPolicy):
        await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    assert not runtime.policy.managed(Principal(hass_admin_user.id, is_admin=True))


async def test_selected_users_persist_after_save_and_reload(runtime, hass, child, grant, hass_admin_user):
    candidate = deepcopy(grant)
    candidate["enabled_users"] = []
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    reloaded = Runtime(hass)
    await reloaded.load()
    assert reloaded.policy.config["enabled_users"] == []
    assert reloaded.policy.config["bindings"][child[0].id] == ["family"]
