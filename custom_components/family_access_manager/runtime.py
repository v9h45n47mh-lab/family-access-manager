"""HA adapter; every prototype operation uses the same permission engine."""

import asyncio
from collections import deque
from copy import deepcopy
from datetime import UTC, datetime
import uuid

from homeassistant.core import Context
from homeassistant.const import EVENT_PANELS_UPDATED
from homeassistant.helpers import device_registry, entity_registry
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION, VERSION
from .gate import DashboardGate, principal
from .policy import InvalidPolicy, Policy, Resource, default_policy, migrate_policy, validate_policy
from .services import validate_service
from .sidebar import SidebarFilter
from .error_log import ERROR_LOG_LIMIT, PermissionErrorLog, request_target


class AccessDenied(Exception):
    """A prototype operation was denied before reading or changing data."""

    def __init__(self, message, *, target=None):
        super().__init__(message)
        self.target = target


class Conflict(Exception):
    """An administrator edited an outdated policy revision."""


class Runtime:
    def __init__(self, hass):
        self.hass = hass
        self.store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.policy = Policy(default_policy())
        self.lock = asyncio.Lock()
        self.events = deque(maxlen=200)
        self.error_log = PermissionErrorLog(hass)
        self.gate = DashboardGate(self)
        self.sidebar = SidebarFilter(self)
        self.probe_entity_id = None
        self.instance_id = uuid.uuid4().hex

    async def load(self):
        saved = await self.store.async_load()
        if saved is not None:
            # Never silently discard a damaged policy and grant wider access.
            migrated = migrate_policy(saved)
            next_policy = Policy(migrated)
            if migrated != saved:
                await self.store.async_save(migrated)
            self.policy = next_policy
        await self.error_log.load()

    def audit(self, user_id, operation, target, allowed):
        self.events.appendleft({
            "time": datetime.now(UTC).isoformat(), "user_id": user_id,
            "operation": operation, "target": target, "allowed": allowed,
        })

    def resource(self, entity_id):
        entry = entity_registry.async_get(self.hass).async_get(entity_id)
        if entry is None:
            return Resource(entity_id)
        device = device_registry.async_get(self.hass).async_get(entry.device_id) if entry.device_id else None
        area = entry.area_id or (device.area_id if device else None)
        labels = set(getattr(entry, "labels", ()))
        if device:
            labels.update(getattr(device, "labels", ()))
        return Resource(entity_id, area, frozenset(labels))

    def dashboards(self):
        from homeassistant.components.lovelace.const import LOVELACE_DATA
        data = self.hass.data.get(LOVELACE_DATA)
        return getattr(data, "dashboards", {}) if data is not None else {}

    def dashboard_catalog(self):
        items = []
        for path, dashboard in self.dashboards().items():
            config = getattr(dashboard, "config", {}) or {}
            canonical = path or "lovelace"
            items.append({"id": canonical, "name": config.get("title", canonical)})
        return sorted({d["id"]: d for d in items}.values(), key=lambda d: d["name"].lower())

    def require_admin(self, user):
        if not self.policy.privileged(principal(user)):
            raise AccessDenied("Diese Funktion ist Administratoren vorbehalten.")

    def require_entity(self, user, entity_id, level):
        actor = principal(user)
        allowed = self.policy.entity(actor, self.resource(entity_id), level)
        allowed = allowed and user.permissions.check_entity(entity_id, "control" if level == "control" else "read")
        self.audit(user.id, f"entity/{level}", entity_id, bool(allowed))
        if not allowed:
            if not self.policy.privileged(actor) and not self.policy.managed(actor):
                reason = "Family Access ist für dieses Konto ausgeschaltet."
            elif not self.policy.entity(actor, self.resource(entity_id), level):
                reason = "Die Rolle enthält keine ausreichende Freigabe für diese Aktion."
            else:
                reason = "Die nativen Home-Assistant-Rechte verweigern diese Aktion."
            raise AccessDenied(reason, target=entity_id)

    async def dispatch(self, user, action, payload, *, source="internal"):
        try:
            return await self._dispatch(user, action, payload)
        except AccessDenied as err:
            target = request_target(action, payload)
            self.error_log.record(user, action, target, str(err), source=source)
            raise
        except InvalidPolicy as err:
            self.error_log.record(user, "save_policy", "Rechtekonfiguration", str(err), source=source, kind="configuration")
            raise
        except Conflict:
            raise
        except ValueError:
            if action == "read_dashboard":
                self.error_log.record(user, action, request_target(action, payload),
                                      "Die Dashboardanfrage ist ungültig oder das Dashboard ist nicht verfügbar.",
                                      source=source, kind="error")
            raise
        except Exception as err:
            self.error_log.record(user, action, request_target(action, payload),
                                  f"Die Anfrage konnte nicht abgeschlossen werden ({type(err).__name__}).",
                                  source=source, kind="error")
            raise

    async def _dispatch(self, user, action, payload):
        if not user.is_active:
            raise AccessDenied("Das Benutzerkonto ist nicht aktiv.")
        if type(payload) is not dict:
            raise ValueError("Ungültige Anfrage.")
        actor = principal(user)
        if action == "admin_panel_status":
            self.require_admin(user)
            return await self._dispatch(user, "status", payload)
        if action == "admin_error_log":
            self.require_admin(user)
            if payload:
                raise ValueError("Diese Anfrage benötigt keine Parameter.")
            return {"events": self.error_log.snapshot(), "limit": ERROR_LOG_LIMIT}
        if action == "status":
            if payload:
                raise ValueError("Diese Anfrage benötigt keine Parameter.")
            return {
                "version": VERSION, "instance_id": self.instance_id,
                "is_admin": self.policy.privileged(actor),
                "managed": self.policy.managed(actor),
                "roles": [r["name"] for r in self.policy.roles(actor)],
                "native_dashboard_gate": self.policy.config["native_dashboard_gate"],
                "gate_available": self.gate.available,
                "sidebar_available": self.sidebar.available,
                "sidebar_filter": self.sidebar.available and self.policy.managed(actor),
                "device_control": self.policy.config["device_control"],
                "probe_entity_id": self.probe_entity_id,
                "scope": "prototype_api_and_optional_dashboard_config_gate",
                "general_ha_api_protected": False,
                "live_nabu_casa_verified": False,
                "dashboards": [d for d in self.dashboard_catalog() if self.policy.dashboard(actor, d["id"])],
            }
        if action == "admin_snapshot":
            self.require_admin(user)
            if payload:
                raise ValueError("Diese Anfrage benötigt keine Parameter.")
            users = await self.hass.auth.async_get_users()
            return {
                "policy": deepcopy(self.policy.config),
                "users": [{"id": u.id, "name": u.name or u.id, "admin": u.is_admin or u.is_owner, "active": u.is_active} for u in users if not u.system_generated],
                "dashboards": self.dashboard_catalog(),
                "events": list(self.events),
                "error_log": self.error_log.snapshot(),
            }
        if action == "save_policy":
            self.require_admin(user)
            candidate = validate_policy(payload)
            users = {u.id: u for u in await self.hass.auth.async_get_users()}
            if any(uid not in users or users[uid].system_generated or users[uid].is_admin or users[uid].is_owner for uid in candidate["bindings"]):
                raise InvalidPolicy("Nur vorhandene persönliche Konten ohne Administratorrechte können eingeschränkt werden.")
            if candidate["native_dashboard_gate"] and not self.gate.available:
                raise InvalidPolicy("Die Dashboard-Prüfung ist mit dieser HA-Version nicht verfügbar.")
            if candidate["enabled_users"] and not self.sidebar.available:
                raise InvalidPolicy("Die Seitenleistenfilterung ist mit dieser HA-Version nicht verfügbar.")
            async with self.lock:
                if candidate["revision"] != self.policy.config["revision"]:
                    raise Conflict("Die Rechte wurden zwischenzeitlich geändert. Bitte neu laden.")
                candidate["revision"] += 1
                next_policy = Policy(candidate)
                await self.store.async_save(next_policy.config)
                self.policy = next_policy
            # HA's panel collection refetches get_panels for each connection.
            self.hass.bus.async_fire(EVENT_PANELS_UPDATED)
            self.audit(user.id, "save_policy", "configuration", True)
            return {"revision": self.policy.config["revision"]}
        if action == "read_entity":
            if set(payload) != {"entity_id"} or not isinstance(payload["entity_id"], str):
                raise ValueError("Bitte eine Entität angeben.")
            entity_id = payload["entity_id"]
            self.require_entity(user, entity_id, "view")
            state = self.hass.states.get(entity_id)
            if state is None:
                raise AccessDenied("Die Entität ist nicht verfügbar oder nicht freigegeben.")
            return state.as_dict()
        if action == "call_service":
            domain, service, entity_ids, data = validate_service(payload)
            for entity_id in entity_ids:
                self.require_entity(user, entity_id, "control")
                if not self.policy.config["device_control"] and entity_id != self.probe_entity_id:
                    raise AccessDenied("Gerätebedienung ist in dieser Prüfversion derzeit ausgeschaltet. Der Testschalter bleibt nutzbar.")
                if self.hass.states.get(entity_id) is None:
                    raise AccessDenied("Die Entität ist nicht verfügbar oder nicht freigegeben.")
            # Never accept user_id, target, templates or a context from the client.
            await self.hass.services.async_call(
                domain, service, dict(data), target={"entity_id": entity_ids},
                blocking=True, context=Context(user_id=user.id),
            )
            return {"executed": True, "entity_ids": entity_ids}
        if action == "read_dashboard":
            if set(payload) != {"url_path"} or not isinstance(payload["url_path"], str):
                raise ValueError("Bitte einen Dashboard-Pfad angeben.")
            path = payload["url_path"]
            allowed = self.policy.dashboard(actor, path)
            self.audit(user.id, "dashboard/view", path, allowed)
            if not allowed:
                raise AccessDenied("Die Rolle enthält keine Freigabe für dieses Dashboard.", target=path)
            dashboard = self.dashboards().get(path)
            if dashboard is None and path == "lovelace":
                dashboard = self.dashboards().get(None)
            if dashboard is None:
                raise ValueError("Dieses Dashboard ist nicht verfügbar.")
            return await dashboard.async_load(False)
        raise ValueError("Unbekannte Funktion.")

