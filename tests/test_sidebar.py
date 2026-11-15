"""User-specific native panel responses, live refresh and safe restoration."""

from copy import deepcopy
import json
from types import SimpleNamespace

import pytest

from homeassistant.components import frontend, websocket_api
from homeassistant.const import EVENT_PANELS_UPDATED

from custom_components.family_access_manager.const import PANEL_PATH
from custom_components.family_access_manager.policy import InvalidPolicy, Policy, Principal, default_policy
from custom_components.family_access_manager.sidebar import SidebarFilter, _PanelConnection, visible_panels


def configuration():
    config = default_policy()
    config["bindings"] = {"child": ["family"]}
    config["enabled_users"] = ["child"]
    config["roles"]["family"]["dashboards"] = {"dashboard-kids": "view"}
    return config


def panel_data():
    return {
        "dashboard-kids": {"component_name": "lovelace", "url_path": "dashboard-kids", "title": "Kinder", "show_in_sidebar": True},
        "dashboard-private": {"component_name": "lovelace", "url_path": "dashboard-private", "title": "Privat"},
        "lovelace": {"component_name": "lovelace", "url_path": "lovelace", "title": "Übersicht"},
        "history": {"component_name": "history", "url_path": "history", "title": "Verlauf"},
        PANEL_PATH: {"component_name": "custom", "url_path": PANEL_PATH, "title": "Family Access", "require_admin": True},
        "profile": {"component_name": "profile", "url_path": "profile", "title": None},
        "notfound": {"component_name": "notfound", "url_path": "notfound", "title": None},
    }


def test_only_allowed_dashboard_and_account_routes_without_mutation():
    panels = panel_data()
    before = deepcopy(panels)
    result = visible_panels(Policy(configuration()), Principal("child"), panels)
    assert set(result) == {"dashboard-kids", "profile", "notfound"}
    assert panels == before
    assert result["dashboard-kids"] == before["dashboard-kids"]


def test_no_grants_hides_all_dashboards_and_default_panel():
    config = configuration()
    config["bindings"]["child"] = []
    assert set(visible_panels(Policy(config), Principal("child"), panel_data())) == {"profile", "notfound"}


@pytest.mark.parametrize("user", [Principal("child", is_admin=True), Principal("child", is_owner=True), Principal("unmanaged")])
def test_admin_owner_and_unmanaged_keep_original_response(user):
    panels = panel_data()
    assert visible_panels(Policy(configuration()), user, panels) is panels


@pytest.mark.parametrize("encoding", ["dict", "str", "bytes", "send_result"])
def test_proxy_handles_native_result_formats(encoding):
    messages = []
    connection = SimpleNamespace(user=Principal("child"), send_message=messages.append,
                                 send_result=lambda mid, result: messages.append({"id": mid, "result": result}))
    runtime = SimpleNamespace(policy=Policy(configuration()))
    proxy = _PanelConnection(connection, runtime, 7)
    message = {"id": 7, "type": "result", "success": True, "result": panel_data()}
    if encoding == "send_result":
        proxy.send_result(7, panel_data())
    else:
        data = message if encoding == "dict" else json.dumps(message)
        proxy.send_message(data.encode() if encoding == "bytes" else data)
    assert set(messages[0]["result"]) == {"dashboard-kids", "profile", "notfound"}
    assert connection.user.id == "child"


def test_sidebar_uninstall_restores_only_owned_handler():
    original = (lambda *args: None, object())
    registry = {"get_panels": original}
    sidebar = SidebarFilter(SimpleNamespace(policy=Policy(configuration())))
    assert sidebar.install(registry)
    assert sidebar.available
    sidebar.uninstall()
    assert registry["get_panels"] is original
    assert sidebar.install(registry)
    replacement = (lambda *args: None, object())
    registry["get_panels"] = replacement
    sidebar.uninstall()
    assert registry["get_panels"] is replacement
    assert not sidebar.available


@pytest.fixture
def panels(runtime, hass):
    for path, data in panel_data().items():
        frontend.async_register_built_in_panel(hass, data["component_name"],
                                              sidebar_title=data["title"], frontend_url_path=path, require_admin=data.get("require_admin", False))
    for path in ("calendar", "media-browser", "logbook", "todo", "unknown-custom"):
        frontend.async_register_built_in_panel(hass, path, sidebar_title=path)
    frontend.async_register_built_in_panel(hass, "lovelace", sidebar_title="Admin", frontend_url_path="dashboard-admin", require_admin=True)
    return deepcopy({path: panel.to_response() for path, panel in hass.data[frontend.DATA_PANELS].items()})


async def get_panels(ws, mid=1):
    await ws.send_json({"id": mid, "type": "get_panels"})
    response = await ws.receive_json()
    assert response["success"], response
    return response["result"]


async def test_native_get_panels_filters_only_managed_user(runtime, hass, child, grant, panels, hass_ws_client):
    # Filtering applies even while the separate direct-config gate is off.
    assert not runtime.policy.config["native_dashboard_gate"]
    selected = await hass_ws_client(hass, access_token=child[1])
    result = await get_panels(selected)
    assert set(result) == {"dashboard-kids", "profile", "notfound"}
    assert result["dashboard-kids"] == panels["dashboard-kids"]
    admin = await hass_ws_client(hass)
    assert await get_panels(admin) == panels
    assert {path: panel.to_response() for path, panel in hass.data[frontend.DATA_PANELS].items()} == panels


async def test_native_ha_admin_restrictions_and_panel_overrides_preserved(runtime, hass, child, grant, panels, hass_ws_client):
    config = deepcopy(grant)
    config["roles"]["family"]["dashboards"]["dashboard-admin"] = "view"
    runtime.policy = Policy(config)
    hass.data[frontend.DATA_PANELS_CONFIG]["dashboard-kids"] = {"title": "Eigener Titel", "show_in_sidebar": False}
    ws = await hass_ws_client(hass, access_token=child[1])
    result = await get_panels(ws)
    assert "dashboard-admin" not in result
    assert result["dashboard-kids"]["title"] == "Eigener Titel"
    assert result["dashboard-kids"]["show_in_sidebar"] is False


async def test_saved_grants_refresh_open_sidebar_and_deactivation_restores_panels(runtime, hass, child, grant, panels, hass_ws_client, hass_admin_user):
    ws = await hass_ws_client(hass, access_token=child[1])
    await ws.send_json({"id": 1, "type": "subscribe_events", "event_type": EVENT_PANELS_UPDATED})
    assert (await ws.receive_json())["success"]
    assert "dashboard-kids" in await get_panels(ws, 2)
    candidate = deepcopy(runtime.policy.config)
    candidate["roles"]["family"]["dashboards"] = {"dashboard-private": "view"}
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    event = await ws.receive_json()
    assert event["type"] == "event" and event["event"]["event_type"] == EVENT_PANELS_UPDATED
    refreshed = await get_panels(ws, 3)
    assert "dashboard-private" in refreshed and "dashboard-kids" not in refreshed
    candidate = deepcopy(runtime.policy.config)
    candidate["enabled_users"] = []
    await runtime.dispatch(hass_admin_user, "save_policy", candidate)
    assert (await ws.receive_json())["type"] == "event"
    restored = await get_panels(ws, 4)
    assert set(restored) == set(panels) - {"dashboard-admin", PANEL_PATH}
    assert runtime.policy.config["bindings"][child[0].id] == ["family"]


async def test_cannot_enable_user_when_sidebar_handler_unavailable(runtime, child, grant, hass_admin_user):
    runtime.sidebar.uninstall()
    with pytest.raises(InvalidPolicy, match="Seitenleistenfilterung"):
        await runtime.dispatch(hass_admin_user, "save_policy", deepcopy(grant))
    assert not runtime.sidebar.available


async def test_family_panel_stays_hidden_after_user_is_not_managed(runtime, hass, child, panels, hass_ws_client):
    ws = await hass_ws_client(hass, access_token=child[1])
    response = await get_panels(ws)
    assert PANEL_PATH not in response
    assert "dashboard-private" in response


def test_managed_user_cannot_whitelist_the_family_panel_as_a_dashboard():
    config = configuration()
    config["roles"]["family"]["dashboards"][PANEL_PATH] = "view"
    panels = panel_data()
    panels[PANEL_PATH]["component_name"] = "lovelace"
    assert PANEL_PATH not in visible_panels(Policy(config), Principal("child"), panels)
