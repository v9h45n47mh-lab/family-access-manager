"""Family Administration: dashboard access and user navigation."""

from pathlib import Path

from homeassistant.components import frontend, panel_custom, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.const import Platform

from .api import RequestView, websocket_request
from .const import DOMAIN, PANEL_PATH, VERSION
from .runtime import Runtime
from .applications import APPLICATION_CLIENTS
from .vacation import CLIENTS as VACATION_CLIENTS, EVENT as VACATION_EVENT, register_service


async def async_setup_entry(hass, entry):
    if entry.title in {"Family Access", "Family Access Manager"}:
        hass.config_entries.async_update_entry(entry, title="Family Administration")
    runtime = Runtime(hass)
    await runtime.load()
    hass.data[DOMAIN] = runtime
    try:
        for application, client in list(hass.data.get(VACATION_CLIENTS, {}).items()):
            await runtime.vacation.import_legacy(application, client['legacy']())
        for application, client in hass.data.get(APPLICATION_CLIENTS, {}).items():
            await runtime.import_application(application, client['legacy'])
        if not hass.data.get(f"{DOMAIN}_registered"):
            register_service(hass)
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
        if not runtime.sidebar.install(hass.data.get(websocket_api.DOMAIN, {})):
            raise RuntimeError("Die Seitenleistenfilterung kann mit dieser HA-Version nicht eingerichtet werden.")
        if not runtime.dashboard_list.install(hass.data.get(websocket_api.DOMAIN, {})):
            raise RuntimeError("Die Dashboardauswahl im Profil kann mit dieser HA-Version nicht gefiltert werden.")
        await panel_custom.async_register_panel(
            hass, frontend_url_path=PANEL_PATH,
            webcomponent_name="family-access-panel", sidebar_title="Family Administration",
            sidebar_icon="mdi:shield-account-outline",
            module_url=f"/family_access_manager_frontend/panel.js?v={VERSION}",
            embed_iframe=False, require_admin=True,
        )
        await hass.config_entries.async_forward_entry_setups(entry, [Platform.SWITCH])
    except Exception:
        runtime.dashboard_list.uninstall()
        runtime.sidebar.uninstall()
        runtime.gate.uninstall()
        frontend.async_remove_panel(hass, PANEL_PATH)
        hass.data.pop(DOMAIN, None)
        raise
    return True


async def async_unload_entry(hass, entry):
    if not await hass.config_entries.async_unload_platforms(entry, [Platform.SWITCH]):
        return False
    runtime = hass.data.pop(DOMAIN)
    hass.bus.async_fire('family_access_manager_updated',{})
    hass.bus.async_fire(VACATION_EVENT,{'available':False})
    await runtime.error_log.flush()
    runtime.dashboard_list.uninstall()
    runtime.sidebar.uninstall()
    runtime.gate.uninstall()
    frontend.async_remove_panel(hass, PANEL_PATH)
    return True

