from copy import deepcopy
from unittest.mock import AsyncMock, patch

import pytest

from custom_components.family_access_manager.policy import Policy
from custom_components.family_access_manager.runtime import AccessDenied

URL = "/api/family_access_manager/request"


async def test_rest_requires_auth(runtime, hass_client_no_auth):
    client = await hass_client_no_auth()
    response = await client.post(URL, json={"action": "status", "payload": {}})
    assert response.status == 401


async def test_rest_cannot_spoof_user(runtime, child, grant, hass_client):
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "admin_snapshot", "payload": {}}, headers={"X-User-Id": "owner"})
    assert response.status == 403
    response = await client.post(URL, json={"action": "status", "payload": {}, "user_id": "owner"})
    assert response.status == 400


async def test_rest_and_websocket_use_same_runtime(runtime, child, grant, hass_client, hass_ws_client, hass):
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "status", "payload": {}})
    rest = (await response.json())["result"]
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "family_access_manager/request", "action": "status"})
    message = await ws.receive_json()
    assert message["success"]
    assert message["result"] == rest
    assert rest["general_ha_api_protected"] is False
    assert rest["live_nabu_casa_verified"] is False


async def test_read_and_control_are_distinct(runtime, hass, child, grant, hass_client):
    hass.states.async_set("switch.probe", "off")
    client = await hass_client(child[1])
    response = await client.post(URL, json={"action": "read_entity", "payload": {"entity_id": "switch.probe"}})
    assert response.status == 200
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        response = await client.post(URL, json={"action": "call_service", "payload": {"domain": "switch", "service": "toggle", "entity_ids": ["switch.probe"], "data": {}}})
        assert response.status == 403
        call.assert_not_called()


async def test_control_forwards_authenticated_context(runtime, hass, child, grant):
    hass.states.async_set("switch.probe", "off")
    grant["roles"]["family"]["entities"]["switch.probe"] = "control"
    runtime.policy = Policy(grant)
    runtime.probe_entity_id = "switch.probe"
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        await runtime.dispatch(child[0], "call_service", {"domain": "switch", "service": "toggle", "entity_ids": ["switch.probe"], "data": {}})
        assert call.call_args.kwargs["context"].user_id == child[0].id
        assert call.call_args.kwargs["target"] == {"entity_id": ["switch.probe"]}


async def test_all_targets_checked_before_first_side_effect(runtime, hass, child, grant):
    grant["device_control"] = True
    grant["roles"]["family"]["entities"]["switch.probe"] = "control"
    runtime.policy = Policy(grant)
    hass.states.async_set("switch.probe", "off")
    with patch("homeassistant.core.ServiceRegistry.async_call", new=AsyncMock()) as call:
        with pytest.raises(AccessDenied):
            await runtime.dispatch(child[0], "call_service", {"domain": "switch", "service": "toggle", "entity_ids": ["switch.probe", "switch.private"], "data": {}})
        call.assert_not_called()


async def test_non_probe_control_disabled_by_default(runtime, hass, child, grant):
    grant["roles"]["family"]["entities"]["switch.probe"] = "control"
    runtime.policy = Policy(grant)
    hass.states.async_set("switch.probe", "off")
    with pytest.raises(AccessDenied):
        await runtime.dispatch(child[0], "call_service", {"domain": "switch", "service": "toggle", "entity_ids": ["switch.probe"], "data": {}})


async def test_native_dashboard_direct_websocket_denied(runtime, hass, child, grant, hass_ws_client):
    grant["native_dashboard_gate"] = True
    runtime.policy = Policy(grant)
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unauthorized"
    await ws.send_json({"id": 2, "type": "lovelace/config", "url_path": "dashboard-kids"})
    msg = await ws.receive_json()
    assert msg["success"]


async def test_existing_connection_observes_revocation(runtime, hass, child, grant, hass_ws_client):
    grant["native_dashboard_gate"] = True
    runtime.policy = Policy(grant)
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-kids"})
    assert (await ws.receive_json())["success"]
    changed = deepcopy(grant)
    changed["bindings"][child[0].id] = []
    runtime.policy = Policy(changed)
    await ws.send_json({"id": 2, "type": "lovelace/config", "url_path": "dashboard-kids"})
    assert not (await ws.receive_json())["success"]


async def test_dashboard_gate_disabled_changes_nothing(runtime, hass, child, grant, hass_ws_client):
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config", "url_path": "dashboard-private"})
    assert (await ws.receive_json())["success"]


async def test_dashboard_edit_does_not_elevate_ha_admin(runtime, hass, child, grant, hass_ws_client):
    grant["native_dashboard_gate"] = True
    grant["roles"]["family"]["dashboards"]["dashboard-kids"] = "edit"
    runtime.policy = Policy(grant)
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "lovelace/config/save", "url_path": "dashboard-kids", "config": {"views": []}})
    msg = await ws.receive_json()
    assert not msg["success"] and msg["error"]["code"] == "unauthorized"
    assert not child[0].is_admin


async def test_atomic_save_and_revision_conflict(runtime, hass_admin_user, child):
    first = deepcopy(runtime.policy.config)
    first["bindings"][child[0].id] = ["family"]
    result = await runtime.dispatch(hass_admin_user, "save_policy", first)
    assert result["revision"] == 1
    from custom_components.family_access_manager.runtime import Conflict
    with pytest.raises(Conflict):
        await runtime.dispatch(hass_admin_user, "save_policy", first)
    second = deepcopy(runtime.policy.config)
    second["device_control"] = True
    with patch.object(runtime.store, "async_save", side_effect=OSError("disk full")):
        with pytest.raises(OSError):
            await runtime.dispatch(hass_admin_user, "save_policy", second)
    assert not runtime.policy.config["device_control"]
    assert runtime.policy.config["revision"] == 1


async def test_large_chunked_body_rejected(runtime, hass_client):
    client = await hass_client()
    async def body():
        for _ in range(20):
            yield b"a" * 16_384
    response = await client.post(URL, data=body())
    assert response.status == 413


async def test_gate_uninstall_restores_only_owned_wrappers(runtime, hass):
    from homeassistant.components import websocket_api
    registry = hass.data[websocket_api.DOMAIN]
    original = runtime.gate.originals["lovelace/config"]
    another = (lambda *args: None, False)
    registry["lovelace/config/delete"] = another
    runtime.gate.uninstall()
    assert registry["lovelace/config"] == original
    assert registry["lovelace/config/delete"] is another

