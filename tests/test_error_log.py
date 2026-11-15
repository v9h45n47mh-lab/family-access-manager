"""Persistent permission diagnostics, authorization, redaction and isolation."""

from copy import deepcopy
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.family_access_manager.error_log import ERROR_LOG_LIMIT, PermissionErrorLog
from custom_components.family_access_manager.policy import Policy, Principal
from custom_components.family_access_manager.runtime import AccessDenied, Runtime

URL = "/api/family_access_manager/request"


async def test_denied_rest_dashboard_records_actor_reason_and_transport(runtime, child, grant, hass_client, hass_admin_user):
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "read_dashboard", "payload": {"url_path": "dashboard-private"}})
    assert response.status == 403
    result = await runtime.dispatch(hass_admin_user, "admin_error_log", {})
    event = result["events"][0]
    assert event["user_id"] == child[0].id and event["user_name"] == "Paul"
    assert event["operation"] == "read_dashboard" and event["target"] == "dashboard-private"
    assert event["source"] == "http" and event["kind"] == "denied"
    assert "keine Freigabe" in event["reason"]
    assert event["time"]


async def test_log_reading_is_admin_only_over_both_transports(runtime, hass, child, grant, hass_client, hass_ws_client):
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "admin_error_log", "payload": {}})
    assert response.status == 403
    assert "events" not in await response.json()
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "family_access_manager/request", "action": "admin_error_log"})
    response = await ws.receive_json()
    assert not response["success"] and response["error"]["code"] == "unauthorized"
    assert runtime.error_log.snapshot()[0]["source"] == "websocket"


async def test_native_gate_and_native_ha_admin_rejections_are_logged(runtime, hass, child, grant, hass_ws_client):
    config = deepcopy(grant)
    config["native_dashboard_gate"] = True
    config["roles"]["family"]["dashboards"]["dashboard-kids"] = "edit"
    runtime.policy = Policy(config)
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert not (await ws.receive_json())["success"]
    first = runtime.error_log.snapshot()[0]
    assert first["target"] == "dashboard-private" and first["source"] == "native_websocket"
    await ws.send_json({"id": 2, "type": "lovelace/config/save", "url_path": "dashboard-kids", "config": {"views": []}})
    assert not (await ws.receive_json())["success"]
    event = runtime.error_log.snapshot()[0]
    assert event["operation"] == "lovelace/config/save"
    assert event["reason"] == "Home Assistant verweigert diese Dashboardaktion."
    assert not child[0].is_admin


async def test_log_survives_runtime_reload_and_is_copied(runtime, hass, child, grant):
    with pytest.raises(AccessDenied):
        await runtime.dispatch(child[0], "read_dashboard", {"url_path": "dashboard-private"})
    await runtime.error_log.flush()
    reloaded = Runtime(hass)
    await reloaded.load()
    assert reloaded.error_log.snapshot() == runtime.error_log.snapshot()
    snapshot = reloaded.error_log.snapshot()
    snapshot[0]["reason"] = "changed"
    assert reloaded.error_log.snapshot()[0]["reason"] != "changed"


async def test_payload_headers_credentials_and_spoofed_identity_not_recorded(runtime, child, grant):
    secret = "Bearer DO_NOT_LOG_THIS_SECRET"
    with pytest.raises(AccessDenied):
        await runtime.dispatch(child[0], "admin_snapshot", {"user_id": "owner", "token": secret}, source="http")
    with pytest.raises(AccessDenied):
        await runtime.dispatch(child[0], "read_entity", {"entity_id": secret})
    import json
    text = json.dumps(runtime.error_log.snapshot())
    assert secret not in text and "token" not in text
    assert all(e["user_id"] == child[0].id for e in runtime.error_log.snapshot())


async def test_technical_error_records_safe_reason_without_exception_payload(runtime, child, grant):
    with patch.object(runtime, "_dispatch", new=AsyncMock(side_effect=RuntimeError("SECRET_PAYLOAD"))):
        with pytest.raises(RuntimeError):
            await runtime.dispatch(child[0], "read_dashboard", {"url_path": "dashboard-kids"})
    event = runtime.error_log.snapshot()[0]
    assert event["kind"] == "error" and "RuntimeError" in event["reason"]
    assert "SECRET_PAYLOAD" not in str(event)


async def test_failed_log_storage_never_changes_denial_or_policy(runtime, child, grant):
    before = deepcopy(runtime.policy.config)
    with patch.object(runtime.error_log.store, "async_delay_save", side_effect=OSError("disk full")):
        with pytest.raises(AccessDenied):
            await runtime.dispatch(child[0], "read_dashboard", {"url_path": "dashboard-private"})
    assert runtime.policy.config == before
    assert runtime.error_log.snapshot()[0]["kind"] == "denied"


async def test_corrupt_diagnostics_do_not_replace_valid_policy(runtime, child, grant):
    before = deepcopy(runtime.policy.config)
    with patch.object(runtime.error_log.store, "async_load", return_value={"events": "broken"}):
        await runtime.error_log.load()
    assert runtime.policy.config == before
    assert runtime.policy.dashboard(Principal(child[0].id), "dashboard-kids")


async def test_persistent_log_is_bounded(hass, child):
    log = PermissionErrorLog(hass)
    with patch.object(log.store, "async_delay_save"):
        for i in range(ERROR_LOG_LIMIT + 5):
            log.record(child[0], "read_dashboard", f"dashboard-{i}", "Keine Freigabe")
    assert len(log.snapshot()) == ERROR_LOG_LIMIT
    assert log.snapshot()[0]["target"] == "dashboard-204"
    assert log.snapshot()[-1]["target"] == "dashboard-5"


async def test_admin_snapshot_contains_diagnostics_but_no_device_catalogs(runtime, hass_admin_user):
    result = await runtime.dispatch(hass_admin_user, "admin_snapshot", {})
    assert "error_log" in result
    assert not {"entities", "areas", "labels"} & result.keys()


async def test_native_check_exception_is_logged_and_request_fails_closed(runtime, hass, child, grant, hass_ws_client):
    config = deepcopy(grant)
    config["native_dashboard_gate"] = True
    runtime.policy = Policy(config)
    ws = await hass_ws_client(hass, access_token=child[1])
    with patch.object(runtime.policy, "dashboard", side_effect=RuntimeError("SECRET_PAYLOAD")):
        await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-kids"})
        assert not (await ws.receive_json())["success"]
    event = runtime.error_log.snapshot()[0]
    assert event["kind"] == "error" and "RuntimeError" in event["reason"]
    assert "SECRET_PAYLOAD" not in str(event)


async def test_unavailable_allowed_dashboard_is_logged(runtime, child, grant):
    config = deepcopy(grant)
    config["roles"]["family"]["dashboards"]["dashboard-deleted"] = "view"
    runtime.policy = Policy(config)
    with pytest.raises(ValueError):
        await runtime.dispatch(child[0], "read_dashboard", {"url_path": "dashboard-deleted"})
    event = runtime.error_log.snapshot()[0]
    assert event["target"] == "dashboard-deleted" and event["kind"] == "error"


async def test_panel_bootstrap_is_server_admin_only_for_direct_rest_and_ws_calls(runtime, hass, child, grant, hass_client, hass_ws_client, hass_admin_user):
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "admin_panel_status", "payload": {}})
    assert response.status == 403
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "family_access_manager/request", "action": "admin_panel_status"})
    message = await ws.receive_json()
    assert not message["success"] and message["error"]["code"] == "unauthorized"
    errors = runtime.error_log.snapshot()
    assert errors[0]["operation"] == "admin_panel_status"
    assert errors[0]["user_id"] == child[0].id
    result = await runtime.dispatch(hass_admin_user, "admin_panel_status", {})
    assert result["is_admin"]
