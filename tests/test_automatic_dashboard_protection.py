"""The built-in dashboard protection cannot be bypassed by the old master switch."""

from copy import deepcopy
from unittest.mock import patch

from custom_components.family_access_manager.policy import default_policy, migrate_policy, validate_policy


def test_legacy_false_is_normalized_without_changing_assignments():
    config = default_policy()
    assert config["native_dashboard_gate"] is True
    config["native_dashboard_gate"] = False
    config["bindings"] = {"child": ["family"], "inactive": ["family"]}
    config["enabled_users"] = ["child"]
    config["roles"]["family"]["dashboards"] = {"dashboard-kids": "view"}
    expected = deepcopy(config)
    expected["native_dashboard_gate"] = True
    assert migrate_policy(config) == expected
    assert validate_policy(config) == expected
    assert config["native_dashboard_gate"] is False, "Validation must not mutate the input"


async def test_old_off_switch_is_migrated_persisted_and_cannot_bypass_native_checks(
    runtime, hass, child, grant, hass_ws_client, hass_admin_user
):
    legacy = deepcopy(grant)
    legacy["native_dashboard_gate"] = False
    with patch.object(runtime.store, "async_load", return_value=legacy), patch.object(runtime.store, "async_save") as save:
        await runtime.load()
        save.assert_awaited_once_with(runtime.policy.config)
    assert runtime.policy.config["native_dashboard_gate"] is True
    assert runtime.policy.config["bindings"] == legacy["bindings"]
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    denied = await ws.receive_json()
    assert denied["error"]["code"] == "unauthorized"
    await ws.send_json({"id": 2, "type": "lovelace/config", "url_path": "dashboard-kids"})
    assert (await ws.receive_json())["success"]
    candidate = deepcopy(runtime.policy.config)
    candidate["native_dashboard_gate"] = False
    saved = await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    assert saved["policy"]["native_dashboard_gate"] is True
    await ws.send_json({"id": 3, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert (await ws.receive_json())["error"]["code"] == "unauthorized"
