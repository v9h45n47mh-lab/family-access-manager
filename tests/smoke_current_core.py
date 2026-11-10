"""Standalone installation/API smoke test, independent of pytest HA fixtures.

Run from the project root with a Python environment containing current HA and
the frontend version requested by HA's frontend manifest. Uses a temporary HA
configuration, local test users and an ephemeral port, never a real home.
"""

import asyncio
import ast
from copy import deepcopy
import json
import logging
from pathlib import Path
import socket
import tempfile
from unittest.mock import AsyncMock, patch

import homeassistant  # Must precede libraries importing the pre-2026.11 httpx.
from aiohttp import ClientSession
from homeassistant import bootstrap, loader
from homeassistant.auth.const import GROUP_ID_ADMIN, GROUP_ID_USER
from homeassistant.const import __version__ as HA_VERSION
from homeassistant.core import HomeAssistant


async def main():
    logging.basicConfig(level=logging.INFO)
    results = {"home_assistant": HA_VERSION, "checks": {}}
    with tempfile.TemporaryDirectory(prefix="fam-core-") as directory:
        config_dir = Path(directory)
        (config_dir / "custom_components").symlink_to(Path(__file__).resolve().parents[1] / "custom_components", target_is_directory=True)
        with socket.socket() as sock:
            sock.bind(("127.0.0.1", 0))
            port = sock.getsockname()[1]
        hass = HomeAssistant(str(config_dir))
        hass.config.skip_pip = True
        loader.async_setup(hass)
        config = {
            "homeassistant": {"name": "Family Access isolated test", "time_zone": "Europe/Berlin"},
            "http": {"server_host": ["127.0.0.1"], "server_port": port},
            "frontend": {}, "lovelace": {"mode": "storage"},
        }
        try:
            assert await bootstrap.async_from_config_dict(config, hass) is not None
            await hass.async_start()
            owner = await hass.auth.async_create_user("Test owner", group_ids=[GROUP_ID_ADMIN])
            child = await hass.auth.async_create_user("Test child", group_ids=[GROUP_ID_USER])
            assert owner.is_owner and not child.is_admin
            flow = await hass.config_entries.flow.async_init("family_access_manager", context={"source": "user"})
            assert flow["type"] == "form"
            created = await hass.config_entries.flow.async_configure(flow["flow_id"], {})
            assert created["type"] == "create_entry"
            await hass.async_block_till_done()
            runtime = hass.data["family_access_manager"]
            assert runtime.probe_entity_id and runtime.gate.available
            results["checks"]["installation_and_virtual_switch"] = True

            from custom_components.family_access_manager.policy import Policy
            policy = deepcopy(runtime.policy.config)
            policy["bindings"][child.id] = ["family"]
            policy["roles"]["family"]["entities"][runtime.probe_entity_id] = "view"
            runtime.policy = Policy(policy)
            refresh = await hass.auth.async_create_refresh_token(child, client_id="https://example.com")
            token = hass.auth.async_create_access_token(refresh)
            base = f"http://127.0.0.1:{port}"
            headers = {"Authorization": "Bearer " + token}
            async with ClientSession() as session:
                async with session.get(base + "/family_access_manager_frontend/family-ui/1.2.1/family-ui.js") as response:
                    assert response.status == 200
                    assert "javascript" in response.headers.get("Content-Type", "")
                    assert 'UI_VERSION = "1.2.1"' in await response.text()
                results["checks"]["vendored_kit_module_served_with_correct_mime"] = True
                async with session.get(base + "/api/brands/marketplace/family_access_manager/icon.png", headers=headers) as response:
                    assert response.status == 200
                    assert (await response.read()) == (Path(__file__).resolve().parents[1] / "custom_components/family_access_manager/brand/icon.png").read_bytes()
                results["checks"]["marketplace_brand_served_locally"] = True
                async with session.post(base + "/api/family_access_manager/request", json={"action": "status", "payload": {}}) as response:
                    assert response.status == 401
                results["checks"]["unauthenticated_rest_denied"] = True
                async with session.post(base + "/api/family_access_manager/request", headers=headers, json={"action": "admin_snapshot", "payload": {}}) as response:
                    assert response.status == 403
                results["checks"]["child_cannot_read_admin_configuration"] = True
                async with session.post(base + "/api/family_access_manager/request", headers=headers, json={"action": "read_entity", "payload": {"entity_id": runtime.probe_entity_id}}) as response:
                    assert response.status == 200
                service = {"domain": "switch", "service": "toggle", "entity_ids": [runtime.probe_entity_id], "data": {}}
                async with session.post(base + "/api/family_access_manager/request", headers=headers, json={"action": "call_service", "payload": service}) as response:
                    assert response.status == 403
                results["checks"]["viewer_can_read_but_cannot_control"] = True
                policy["roles"]["family"]["entities"][runtime.probe_entity_id] = "control"
                runtime.policy = Policy(policy)
                async with session.post(base + "/api/family_access_manager/request", headers=headers, json={"action": "call_service", "payload": service}) as response:
                    assert response.status == 200, await response.text()
                assert hass.states.get(runtime.probe_entity_id).state == "on"
                results["checks"]["controller_really_toggles_virtual_switch"] = True
                async with session.post(base + "/api/family_access_manager/request", headers=headers, json={"action": "status", "payload": {}}) as response:
                    rest_status = (await response.json())["result"]
                async with session.ws_connect(base + "/api/websocket") as ws:
                    assert (await ws.receive_json())["type"] == "auth_required"
                    await ws.send_json({"type": "auth", "access_token": token})
                    assert (await ws.receive_json())["type"] == "auth_ok"
                    await ws.send_json({"id": 1, "type": "family_access_manager/request", "action": "status"})
                    msg = await ws.receive_json()
                    assert msg["success"] and msg["result"]["instance_id"] == rest_status["instance_id"]
                    results["checks"]["rest_and_websocket_share_policy_instance"] = True
                    policy["native_dashboard_gate"] = True
                    runtime.policy = Policy(policy)
                    await ws.send_json({"id": 2, "type": "lovelace/config"})
                    denied = await ws.receive_json()
                    assert not denied["success"] and denied["error"]["code"] == "unauthorized"
                    results["checks"]["native_dashboard_gate_on_existing_connection"] = True
            # Inspect the installed official adapter without importing unrelated
            # Alexa/camera dependencies. This is NOT a live relay test.
            cloud_source = (Path(homeassistant.__file__).parent / "components/cloud/client.py").read_text()
            tree = ast.parse(cloud_source)
            cls = next(n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "CloudClient")
            getter = next(n for n in cls.body if isinstance(n, ast.FunctionDef) and n.name == "aiohttp_runner")
            returned = next(n.value for n in getter.body if isinstance(n, ast.Return))
            assert ast.dump(returned) == ast.dump(ast.parse("self._hass.http.runner", mode="eval").body)
            assert hass.http.runner is not None
            assert hass.http.runner.app is hass.http.app
            results["checks"]["cloud_adapter_source_points_to_same_runner"] = True
            await runtime.dispatch(owner, "save_policy", deepcopy(runtime.policy.config))
            entry = created["result"]
            assert await hass.config_entries.async_unload(entry.entry_id)
            assert "family_access_manager" not in hass.data
            results["checks"]["clean_unload"] = True
            assert await hass.config_entries.async_setup(entry.entry_id)
            await hass.async_block_till_done()
            reloaded = hass.data["family_access_manager"]
            assert reloaded.policy.config["native_dashboard_gate"]
            assert reloaded.policy.config["bindings"][child.id] == ["family"]
            assert reloaded.gate.available
            results["checks"]["policy_persists_across_reload"] = True
            assert await hass.config_entries.async_unload(entry.entry_id)
        finally:
            await hass.async_stop(force=True)
    results["live_nabu_casa_test"] = "not_performed"
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    # Isolated CI has no permission to enumerate host interfaces. Supply a
    # loopback-only adapter; HTTP and WebSocket still use real TCP requests.
    import ifaddr
    adapter = ifaddr.Adapter("lo", "lo", [ifaddr.IP("127.0.0.1", 8, "lo")], index=1)
    with patch("ifaddr.get_adapters", return_value=[adapter]), patch(
        "homeassistant.components.http.async_get_source_ip", new=AsyncMock(return_value="127.0.0.1")
    ):
        asyncio.run(main())
