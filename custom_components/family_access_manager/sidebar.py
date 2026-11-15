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
    if not policy.managed(user):
        return panels
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
    def __init__(self, runtime):
        self.runtime = runtime
        self.registry = None
        self.original = None
        self.wrapper = None

    @property
    def available(self):
        return self.registry is not None and self.registry.get("get_panels", (None,))[0] is self.wrapper

    def install(self, registry):
        original = registry.get("get_panels")
        if not isinstance(original, tuple) or len(original) != 2:
            return False
        handler, schema = original

        @wraps(handler)
        def filtered(hass, connection, msg):
            if not self.runtime.policy.managed(principal(connection.user)):
                return handler(hass, connection, msg)
            return handler(hass, _PanelConnection(connection, self.runtime, msg["id"]), msg)

        self.registry, self.original, self.wrapper = registry, original, filtered
        registry["get_panels"] = (filtered, schema)
        return True

    def uninstall(self):
        if self.available:
            self.registry["get_panels"] = self.original
        self.registry = self.original = self.wrapper = None
