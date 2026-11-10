"""Family Access Manager: an explicitly scoped permission prototype."""

from pathlib import Path

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import Platform

from .api import RequestView, websocket_request
from .const import DOMAIN, PANEL_PATH, VERSION
from .runtime import Runtime


async def async_setup_entry(hass, entry):
    runtime = Runtime(hass)
    await runtime.load()
    hass.data[DOMAIN] = runtime
    try:
        if not hass.data.get(f"{DOMAIN}_registered"):
            hass.http.register_view(RequestView())
            websocket_api.async_register_command(hass, websocket_request)
            await hass.http.async_register_static_paths([
                StaticPathConfig(
                    "/family_access_manager_frontend",
                    str(Path(__file__).parent / "frontend"), False,
                ),
            ])
            hass.data[f"{DOMAIN}_registered"] = True
        runtime.gate.install(hass.data.get(websocket_api.DOMAIN, {}))
        if runtime.policy.config["native_dashboard_gate"] and not runtime.gate.available:
            raise RuntimeError("Die gespeicherte Dashboard-Sperre kann mit dieser HA-Version nicht eingerichtet werden.")
        await panel_custom.async_register_panel(
            hass, frontend_url_path=PANEL_PATH,
            webcomponent_name="family-access-panel", sidebar_title="Family Access",
            sidebar_icon="mdi:shield-account-outline",
            module_url=f"/family_access_manager_frontend/panel.js?v={VERSION}",
            embed_iframe=False, require_admin=False,
        )
        await hass.config_entries.async_forward_entry_setups(entry, [Platform.SWITCH])
    except Exception:
        runtime.gate.uninstall()
        frontend.async_remove_panel(hass, PANEL_PATH)
        hass.data.pop(DOMAIN, None)
        raise
    return True


async def async_unload_entry(hass, entry):
    if not await hass.config_entries.async_unload_platforms(entry, [Platform.SWITCH]):
        return False
    runtime = hass.data.pop(DOMAIN)
    runtime.gate.uninstall()
    frontend.async_remove_panel(hass, PANEL_PATH)
    return True

