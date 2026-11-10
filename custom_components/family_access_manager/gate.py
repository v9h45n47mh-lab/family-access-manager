"""Small, reversible experiment on HA's shared WebSocket command registry.

It guards dashboard CONFIG requests only. This is not a general HA firewall.
It never upgrades a non-administrator to an administrator.
"""

from functools import wraps

from .policy import Principal

COMMAND_LEVELS = {
    "lovelace/config": "view",
    "lovelace/config/save": "edit",
    "lovelace/config/delete": "edit",
}


def principal(user) -> Principal:
    return Principal(user.id, user.is_admin, user.is_owner, user.is_active)


class DashboardGate:
    def __init__(self, runtime):
        self.runtime = runtime
        self.originals = {}
        self.wrappers = {}
        self.registry = None

    @property
    def available(self) -> bool:
        return bool(self.registry is not None) and all(
            self.registry.get(k, (None,))[0] is self.wrappers.get(k)
            for k in COMMAND_LEVELS
        )

    def install(self, registry: dict) -> bool:
        if not all(k in registry and isinstance(registry[k], tuple) and len(registry[k]) == 2 for k in COMMAND_LEVELS):
            return False
        self.registry = registry
        for name, level in COMMAND_LEVELS.items():
            handler, schema = registry[name]
            wrapped = self._wrap(name, level, handler)
            self.originals[name] = registry[name]
            self.wrappers[name] = wrapped
            registry[name] = (wrapped, schema)
        return True

    def _wrap(self, name, level, original):
        @wraps(original)
        def guarded(hass, connection, msg):
            policy = self.runtime.policy
            user = principal(connection.user)
            if policy.config["native_dashboard_gate"] and policy.managed(user):
                path = msg.get("url_path") or "lovelace"
                if not policy.dashboard(user, path, level):
                    self.runtime.audit(user.id, name, path, False)
                    connection.send_error(msg["id"], "unauthorized", "Dieses Dashboard ist nicht freigegeben.")
                    return
            return original(hass, connection, msg)
        return guarded

    def uninstall(self):
        if self.registry is not None:
            for name, original in self.originals.items():
                if self.registry.get(name, (None,))[0] is self.wrappers[name]:
                    self.registry[name] = original
        self.originals.clear()
        self.wrappers.clear()
        self.registry = None

