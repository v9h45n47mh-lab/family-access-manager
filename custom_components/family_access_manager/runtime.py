"""HA adapter; every operation uses the same permission engine."""

import asyncio
from collections import deque
from copy import deepcopy
from datetime import UTC, datetime
import uuid
import hashlib
import json

from .vacation import Vacation
from .applications import APPLICATIONS, APPLICATION_PROTOCOL, APPLICATION_CLIENTS, APPLICATION_EVENT

from homeassistant.core import Context
from homeassistant.const import EVENT_PANELS_UPDATED
from homeassistant.helpers import device_registry, entity_registry
from homeassistant.helpers.storage import Store

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION, VERSION
from .gate import DashboardGate, principal
from .policy import InvalidPolicy, Policy, Resource, default_policy, migrate_policy, validate_policy
from .services import validate_service
from .sidebar import DashboardListFilter, SidebarFilter
from .sidebar_preferences import admin_sidebar, apply_order, ordered_dashboards, save_admin_sidebar
from .error_log import ERROR_LOG_LIMIT, PermissionErrorLog, request_target


class AccessDenied(Exception):
    """An operation was denied before reading or changing data."""

    def __init__(self, message, *, target=None):
        super().__init__(message)
        self.target = target


class Conflict(Exception):
    """An administrator edited an outdated policy revision."""


class Runtime:
    application_protocol = APPLICATION_PROTOCOL
    vacation_protocol = 1

    def __init__(self, hass):
        self.hass = hass
        self.store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self.vacation = Vacation(hass)
        self.policy = Policy(default_policy())
        self.lock = asyncio.Lock()
        self.events = deque(maxlen=200)
        self.error_log = PermissionErrorLog(hass)
        self.gate = DashboardGate(self)
        self.sidebar = SidebarFilter(self)
        self.dashboard_list = DashboardListFilter(self)
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
        await self.vacation.load()

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
                reason = "Family Administration ist für dieses Konto ausgeschaltet."
            elif not self.policy.entity(actor, self.resource(entity_id), level):
                reason = "Die Rolle enthält keine ausreichende Freigabe für diese Aktion."
            else:
                reason = "Die nativen Home-Assistant-Rechte verweigern diese Aktion."
            raise AccessDenied(reason, target=entity_id)

    async def dispatch(self, user, action, payload, *, source="internal"):
        try:
            return await self._dispatch(user, action, payload, source=source)
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

    async def _dispatch(self, user, action, payload, *, source="internal"):
        if not user.is_active:
            raise AccessDenied("Das Benutzerkonto ist nicht aktiv.")
        if type(payload) is not dict:
            raise ValueError("Ungültige Anfrage.")
        actor = principal(user)
        if action in {"admin_sidebar", "save_admin_sidebar", "apply_dashboard_order"}:
            self.require_admin(user)
            return await self.sidebar_request(user, action, payload, source=source)
        if action == "admin_panel_status":
            self.require_admin(user)
            return await self._dispatch(user, "status", payload)
        if action in {"vacation_status", "set_vacation"}:
            self.require_admin(user)
            if action == 'vacation_status':
                if payload:raise ValueError('Diese Anfrage benötigt keine Parameter.')
                return self.vacation.snapshot()
            if set(payload) not in ({'enabled'}, {'enabled','revision'}):raise ValueError('Ungültige Anfrage.')
            result=await self.vacation.set(payload['enabled'],payload.get('revision'))
            self.audit(user.id,'set_vacation','Urlaubsmodus',True)
            return result
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
                "dashboard_list_available": self.dashboard_list.available,
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
                "vacation": self.vacation.snapshot(),
                "applications": [{"id":app, **descriptor, "connected": app in self.hass.data.get(APPLICATION_CLIENTS,{})} for app,descriptor in APPLICATIONS.items()],
            }
        if action == "save_policy":
            self.require_admin(user)
            candidate = validate_policy(payload)
            users = {u.id: u for u in await self.hass.auth.async_get_users()}
            assigned_users = set(candidate['bindings']) | set(candidate['app_bindings'])
            stale = [uid for uid in assigned_users
                     if uid not in users or users[uid].system_generated or users[uid].is_admin or users[uid].is_owner]
            for uid in stale:
                old = self.policy.config
                if (any(candidate[key].get(uid) != old[key].get(uid) for key in ('bindings', 'app_bindings'))
                        or (uid in candidate['enabled_users']) != (uid in old['enabled_users'])):
                    raise InvalidPolicy('Nur vorhandenen persönlichen Konten ohne HA-Administratorrechte können Darstellungen und App-Rollen zugewiesen werden.')
                candidate['bindings'].pop(uid, None)
                candidate['app_bindings'].pop(uid, None)
            candidate['enabled_users'] = [uid for uid in candidate['enabled_users'] if uid not in stale]
            if candidate["native_dashboard_gate"] and not self.gate.available:
                raise InvalidPolicy("Die Dashboard-Prüfung ist mit dieser HA-Version nicht verfügbar.")
            if candidate["enabled_users"] and not self.sidebar.available:
                raise InvalidPolicy("Die Seitenleistenfilterung ist mit dieser HA-Version nicht verfügbar.")
            if candidate["enabled_users"] and not self.dashboard_list.available:
                raise InvalidPolicy("Die Dashboardauswahl im Profil kann mit dieser HA-Version nicht gefiltert werden.")
            async with self.lock:
                if candidate["revision"] != self.policy.config["revision"]:
                    raise Conflict("Die Rechte wurden zwischenzeitlich geändert. Bitte neu laden.")
                candidate["revision"] += 1
                next_policy = Policy(candidate)
                await self.store.async_save(next_policy.config)
                self.policy = next_policy
            # HA's panel collection refetches get_panels for each connection.
            self.hass.bus.async_fire(EVENT_PANELS_UPDATED)
            self.hass.bus.async_fire(APPLICATION_EVENT, {"revision": self.policy.config["revision"]})
            self.audit(user.id, "save_policy", "configuration", True)
            return {"revision": self.policy.config["revision"], "policy": deepcopy(self.policy.config)}
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
                    raise AccessDenied("Die Gerätebedienung über diese API ist ausgeschaltet. Der Testschalter bleibt nutzbar.")
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

    async def sidebar_request(self, actor, action, payload, *, source):
        """An admin may edit navigation preferences, never grant HA privileges."""
        users = {u.id: u for u in await self.hass.auth.async_get_users() if not u.system_generated}
        catalog = self.dashboard_catalog()
        if action in {"admin_sidebar", "save_admin_sidebar"}:
            expected = {"user_id"} if action == "admin_sidebar" else {"user_id", "token", "visible_dashboards", "default_panel"}
            if set(payload) != expected or not isinstance(payload.get("user_id"), str):
                raise ValueError("Bitte einen Administrator auswählen.")
            uid = payload["user_id"]
            target = users.get(uid)
            if target is None or not (target.is_admin or target.is_owner):
                raise ValueError("Die Seitenleistenauswahl gilt nur für persönliche Administratorkonten.")
            if action == "admin_sidebar":
                return await admin_sidebar(self.hass, uid, catalog)
            visible, default = payload["visible_dashboards"], payload["default_panel"]
            known = {d["id"] for d in catalog}
            if (type(visible) is not list or not all(isinstance(p, str) and p in known for p in visible)
                    or len(visible) != len(set(visible)) or not isinstance(default, str)
                    or not isinstance(payload["token"], str)):
                raise ValueError("Ungültige Dashboardauswahl.")
            async with self.lock:
                current = await admin_sidebar(self.hass, uid, catalog)
                if payload["token"] != current["token"]:
                    raise Conflict("Die Seitenleiste wurde zwischenzeitlich geändert. Bitte erneut öffnen.")
                if default not in known | {current["default_panel"], "profile"} or (default in known and default not in visible):
                    raise ValueError("Die Startseite muss sichtbar bleiben. Bitte eine andere Startseite wählen.")
                await save_admin_sidebar(self.hass, uid, visible, default, catalog)
            self.audit(actor.id, action, uid, True)
            return await admin_sidebar(self.hass, uid, catalog)
        if (set(payload) != {"role_id", "user_ids", "revision"}
                or not isinstance(payload["role_id"], str)
                or type(payload["revision"]) is not int
                or type(payload["user_ids"]) is not list
                or not 1 <= len(payload["user_ids"]) <= 500
                or not all(isinstance(uid, str) and uid in users for uid in payload["user_ids"])
                or len(payload["user_ids"]) != len(set(payload["user_ids"]))):
            raise ValueError("Bitte vorhandene persönliche Benutzer auswählen.")
        async with self.lock:
            if payload["revision"] != self.policy.config["revision"]:
                raise Conflict("Die Rollen wurden zwischenzeitlich geändert. Bitte neu laden.")
            role = self.policy.config["roles"].get(payload["role_id"])
            if role is None:
                raise ValueError("Diese Rolle existiert nicht.")
            ordered = ordered_dashboards(role, catalog)
            if not ordered:
                raise ValueError("Für diese Rolle sind keine Dashboards gewählt.")
            applied, failed = [], []
            for uid in payload["user_ids"]:
                try:
                    await apply_order(self.hass, uid, ordered, catalog)
                except Exception:
                    failed.append(uid)
                    self.error_log.record(actor, action, uid, "Die Dashboardreihenfolge konnte für dieses Konto nicht gespeichert werden.", source=source, kind="error")
                else:
                    applied.append(uid)
                    self.audit(actor.id, action, uid, True)
            return {"applied": applied, "failed": failed}


    def application_permissions(self, user, application):
        return self.policy.application_permissions(principal(user), application)

    def application_denied(self, user, application, permission):
        self.error_log.record(user, application+'/'+permission, application,
                              'Die zugewiesenen Rollen enthalten diese Anwendungsfreigabe nicht.', source='application')

    async def import_application(self, application, legacy):
        if application not in APPLICATIONS:
            raise ValueError('Unbekannte Anwendung.')
        async with self.lock:
            if application in self.policy.config['imported_applications']:
                return
            candidate = deepcopy(self.policy.config)
            keys = APPLICATIONS[application]['permissions']
            for user in await self.hass.auth.async_get_users():
                if user.system_generated or not user.is_active or user.is_admin or user.is_owner:
                    continue
                assigned = candidate['app_bindings'].get(user.id, [])
                if any(application in candidate['app_roles'][rid]['applications'] for rid in assigned):
                    continue
                raw = legacy(user)
                grants = {key: True for key in keys if raw.get(key, False) is True}
                if not grants:
                    continue
                digest = hashlib.sha256(json.dumps(grants,sort_keys=True).encode()).hexdigest()[:10]
                rid = 'import_'+application+'_'+digest
                if rid not in candidate['app_roles']:
                    management = any(grants.get(key) for key in ('manage','settings','manage_catalog','delete_others','edit_others','confirm_any','alarms_others'))
                    label = 'Verwaltung' if management else 'Benutzer'
                    candidate['app_roles'][rid] = {'name':APPLICATIONS[application]['name']+' · '+label+' (übernommen)',
                        'applications':{application:grants}}
                candidate['app_bindings'].setdefault(user.id,[]).append(rid)
            candidate['imported_applications'].append(application)
            candidate['revision'] += 1
            next_policy = Policy(candidate)
            await self.store.async_save(next_policy.config)
            self.policy = next_policy
        self.hass.bus.async_fire(APPLICATION_EVENT, {'revision':self.policy.config['revision']})
        self.audit('system','application_import',application,True)
