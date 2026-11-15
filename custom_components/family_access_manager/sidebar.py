"""Return a user-specific panel list through HA's original get_panels handler.

This changes navigation only. The dashboard gate and entity API checks remain
independent. No global panel, user preference or connection method is mutated.
"""

from functools import wraps
import json

from .const import PANEL_PATH
from .gate import principal

# Account access and internal frontend routing do not appear as dashboard grants.
SYSTEM_ROUTES = frozenset({"profile", "notfound", "_my_redirect", "app"})


def visible_panels(policy, user, panels):
    """Keep allowed dashboards and account routes for managed users."""
    if not policy.presentation_managed(user):
        return panels
    if policy.privileged(user):
        # Admin presentation changes navigation, never native authorization.
        return {key: panel for key, panel in panels.items()
                if (panel.get('url_path') or key) == PANEL_PATH
                or panel.get('component_name') != 'lovelace'
                or policy.presentation_dashboard(user, panel.get('url_path') or key)}
    result = {}
    for key, panel in panels.items():
        path = panel.get("url_path") or key
        if path == PANEL_PATH:
            continue
        if path in SYSTEM_ROUTES:
            result[key] = panel
        elif panel.get("component_name") == "lovelace" and policy.dashboard(user, path):
            result[key] = panel
    return result


class _PanelConnection:
    """Delegate HA authorization and filter only this command's result."""

    def __init__(self, connection, runtime, message_id):
        self._connection = connection
        self._runtime = runtime
        self._message_id = message_id

    def __getattr__(self, name):
        return getattr(self._connection, name)

    def _filter(self, panels):
        if type(panels) is not dict:
            raise ValueError("Home Assistant hat keine gültige Seitenleistenliste geliefert.")
        return visible_panels(self._runtime.policy, principal(self.user), panels)

    def send_result(self, message_id, result=None):
        if message_id == self._message_id:
            result = self._filter(result)
        self._connection.send_result(message_id, result)

    def send_message(self, message):
        decoded = json.loads(message) if isinstance(message, (bytes, str)) else message
        if (isinstance(decoded, dict) and decoded.get("id") == self._message_id
                and decoded.get("type") == "result" and decoded.get("success") is True):
            decoded = {**decoded, "result": self._filter(decoded.get("result"))}
            self._connection.send_message(decoded)
        else:
            self._connection.send_message(message)


class SidebarFilter:
    command = "get_panels"
    connection_type = _PanelConnection

    def __init__(self, runtime):
        self.runtime = runtime
        self.registry = None
        self.original = None
        self.wrapper = None

    @property
    def available(self):
        return self.registry is not None and self.registry.get(self.command, (None,))[0] is self.wrapper

    def install(self, registry):
        original = registry.get(self.command)
        if not isinstance(original, tuple) or len(original) != 2:
            return False
        handler, schema = original

        @wraps(handler)
        def filtered(hass, connection, msg):
            if not self.runtime.policy.presentation_managed(principal(connection.user)):
                return handler(hass, connection, msg)
            return handler(hass, self.connection_type(connection, self.runtime, msg["id"]), msg)

        self.registry, self.original, self.wrapper = registry, original, filtered
        registry[self.command] = (filtered, schema)
        return True

    def uninstall(self):
        if self.available:
            self.registry[self.command] = self.original
        self.registry = self.original = self.wrapper = None


def visible_dashboards(policy, user, dashboards):
    """HA's profile picker fetches this catalog independently of get_panels."""
    if not policy.presentation_managed(user):
        return dashboards
    return [dashboard for dashboard in dashboards
            if isinstance(dashboard, dict)
            and isinstance(dashboard.get("url_path"), str)
            and dashboard["url_path"] != PANEL_PATH
            and (policy.privileged(user) or not dashboard.get("require_admin", False))
            and policy.presentation_dashboard(user, dashboard["url_path"])]


class _DashboardConnection(_PanelConnection):
    def _filter(self, dashboards):
        if type(dashboards) is not list:
            raise ValueError("Home Assistant hat keine gültige Dashboardliste geliefert.")
        return visible_dashboards(self._runtime.policy, principal(self.user), dashboards)


class DashboardListFilter(SidebarFilter):
    """Keep the native profile dashboard picker within the user's grants."""

    command = "lovelace/dashboards/list"
    connection_type = _DashboardConnection
