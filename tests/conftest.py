from types import SimpleNamespace

import pytest

from homeassistant.auth.const import GROUP_ID_USER
from homeassistant.components import websocket_api
from homeassistant.components.lovelace.const import LOVELACE_DATA
from homeassistant.components.lovelace import websocket as lovelace_ws
from homeassistant.setup import async_setup_component

from custom_components.family_access_manager.api import RequestView, websocket_request
from custom_components.family_access_manager.const import DOMAIN
from custom_components.family_access_manager.runtime import Runtime

pytest_plugins = ["pytest_homeassistant_custom_component"]


class Dashboard:
    config = {"title": "Kinder"}

    async def async_load(self, force=False):
        return {"views": [{"title": "Kinder", "cards": []}]}

    async def async_json(self, force=False):
        from homeassistant.helpers.json import json_fragment
        return json_fragment('{"views":[{"title":"Kinder","cards":[]}]}')


@pytest.fixture
async def runtime(hass):
    assert await async_setup_component(hass, "websocket_api", {})
    instance = Runtime(hass)
    hass.data[DOMAIN] = instance
    hass.data[LOVELACE_DATA] = SimpleNamespace(dashboards={"dashboard-kids": Dashboard(), "dashboard-private": Dashboard()}, resource_mode="storage")
    hass.http.register_view(RequestView())
    websocket_api.async_register_command(hass, websocket_request)
    for handler in (lovelace_ws.websocket_lovelace_config, lovelace_ws.websocket_lovelace_save_config, lovelace_ws.websocket_lovelace_delete_config):
        websocket_api.async_register_command(hass, handler)
    assert instance.gate.install(hass.data[websocket_api.DOMAIN])
    yield instance
    instance.gate.uninstall()
    hass.data.pop(DOMAIN, None)


@pytest.fixture
async def child(hass, local_auth, hass_admin_user):
    user = await hass.auth.async_create_user("Paul", group_ids=[GROUP_ID_USER])
    token = await hass.auth.async_create_refresh_token(user, client_id="https://example.com")
    return user, hass.auth.async_create_access_token(token)


@pytest.fixture
def grant(runtime, child):
    from custom_components.family_access_manager.policy import Policy
    config = runtime.policy.config.copy()
    config["bindings"] = {child[0].id: ["family"]}
    config["roles"] = {"family": {"name": "Paul", "dashboards": {"dashboard-kids": "view"}, "entities": {"switch.probe": "view"}, "areas": {}, "labels": {}}}
    runtime.policy = Policy(config)
    return config

