"""Pure, transport-independent permission evaluation. No HA imports."""

from copy import deepcopy
from dataclasses import dataclass, field
import json
import hashlib
import re

from .applications import APPLICATIONS

LEVELS = {"none": 0, "view": 1, "control": 2, "edit": 3}
ROLE_ID = re.compile(r"^[a-zA-Z0-9_-]{1,80}$")
ENTITY_ID = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
DASHBOARD_ID = re.compile(r"^[a-zA-Z0-9_-]{1,160}$")


class InvalidPolicy(ValueError):
    """An invalid or ambiguous policy must never be installed."""


@dataclass(frozen=True)
class Principal:
    id: str
    is_admin: bool = False
    is_owner: bool = False
    is_active: bool = True


@dataclass(frozen=True)
class Resource:
    entity_id: str
    area_id: str | None = None
    label_ids: frozenset[str] = field(default_factory=frozenset)


def _legacy_default_policy() -> dict:
    return {
        "revision": 0,
        "native_dashboard_gate": False,
        "device_control": False,
        "roles": {
            "family": {
                "name": "Familie", "dashboard_order": [], "applications": {},
                "dashboards": {}, "entities": {}, "areas": {}, "labels": {},
            },
        },
        "bindings": {},
        "enabled_users": [],
        "imported_applications": [],
    }


def _validate_legacy_policy(raw: object) -> dict:
    """Validate strictly before persistence; never coerce truthy strings."""
    if type(raw) is not dict:
        raise InvalidPolicy("Die Rechtekonfiguration muss ein Objekt sein.")
    expected = {"revision", "native_dashboard_gate", "device_control", "roles", "bindings", "enabled_users", "imported_applications"}
    if set(raw) != expected:
        raise InvalidPolicy("Die Rechtekonfiguration enthält fehlende oder unbekannte Felder.")
    if type(raw["revision"]) is not int or raw["revision"] < 0:
        raise InvalidPolicy("Ungültiger Speicherstand.")
    for key in ("native_dashboard_gate", "device_control"):
        if type(raw[key]) is not bool:
            raise InvalidPolicy(f"{key} muss wahr oder falsch sein.")
    roles, bindings = raw["roles"], raw["bindings"]
    if type(roles) is not dict or len(roles) > 100:
        raise InvalidPolicy("Höchstens 100 Rollen sind zulässig.")
    if type(bindings) is not dict or len(bindings) > 500:
        raise InvalidPolicy("Ungültige Benutzerzuordnung.")
    for role_id, role in roles.items():
        if not isinstance(role_id, str) or not ROLE_ID.fullmatch(role_id):
            raise InvalidPolicy("Ungültige Rollen-ID.")
        if type(role) is not dict or set(role) != {"name", "dashboard_order", "applications", "dashboards", "entities", "areas", "labels"}:
            raise InvalidPolicy("Ungültige Rollenstruktur.")
        if not isinstance(role["name"], str) or not 1 <= len(role["name"].strip()) <= 80:
            raise InvalidPolicy("Bitte einen Rollennamen mit 1–80 Zeichen angeben.")
        apps = role['applications']
        if type(apps) is not dict or any(app not in APPLICATIONS for app in apps):
            raise InvalidPolicy('Unbekannte Anwendung in der Rolle.')
        for app, grants in apps.items():
            if (type(grants) is not dict or any(key not in APPLICATIONS[app]['permissions'] for key in grants)
                    or any(type(value) is not bool for value in grants.values())):
                raise InvalidPolicy('Anwendungsrechte müssen bekannte Wahrheitswerte sein.')
        order = role["dashboard_order"]
        if (type(order) is not list or len(order) > 3000
                or not all(isinstance(path, str) and DASHBOARD_ID.fullmatch(path) for path in order)
                or len(order) != len(set(order))):
            raise InvalidPolicy("Ungültige Dashboardreihenfolge.")
        for section in ("dashboards", "entities", "areas", "labels"):
            grants = role[section]
            if type(grants) is not dict or len(grants) > 3000:
                raise InvalidPolicy("Zu viele oder ungültige Freigaben.")
            for key, level in grants.items():
                if not isinstance(key, str) or not 1 <= len(key) <= 160:
                    raise InvalidPolicy("Ungültiges Freigabeziel.")
                if section == "entities" and not ENTITY_ID.fullmatch(key):
                    raise InvalidPolicy("Ungültige Entitäts-ID.")
                if section == "dashboards" and not DASHBOARD_ID.fullmatch(key):
                    raise InvalidPolicy("Ungültiger Dashboard-Pfad.")
                if not isinstance(level, str) or level not in LEVELS:
                    raise InvalidPolicy("Unbekannte Berechtigungsstufe.")
                if section != "dashboards" and level == "edit":
                    raise InvalidPolicy("Geräte können angezeigt oder bedient werden.")
    for user_id, assigned in bindings.items():
        if not isinstance(user_id, str) or not 1 <= len(user_id) <= 160:
            raise InvalidPolicy("Ungültige Benutzer-ID.")
        if type(assigned) is not list or len(assigned) > 20 or not all(isinstance(r, str) for r in assigned) or len(assigned) != len(set(assigned)):
            raise InvalidPolicy("Ungültige Rollenzuordnung.")
        if not all(isinstance(r, str) and r in roles for r in assigned):
            raise InvalidPolicy("Eine zugewiesene Rolle existiert nicht.")
    enabled = raw["enabled_users"]
    if (type(enabled) is not list or len(enabled) > 500
            or not all(isinstance(uid, str) for uid in enabled)
            or len(enabled) != len(set(enabled))
            or any(uid not in bindings for uid in enabled)):
        raise InvalidPolicy("Aktivierte Benutzer benötigen eine eindeutige Benutzer- und Rollenzuordnung.")
    imported = raw['imported_applications']
    if (type(imported) is not list or not all(isinstance(app,str) and app in APPLICATIONS for app in imported)
            or len(imported) != len(set(imported))):
        raise InvalidPolicy('Ungültiger Übernahmestand der Anwendungen.')
    if len(json.dumps(raw).encode()) > 250_000:
        raise InvalidPolicy("Die Rechtekonfiguration ist zu groß.")
    return deepcopy(raw)


def _migrate_legacy_policy(raw: object) -> dict:
    """Keep existing managed users enabled when loading the pre-0.3 format.

    Only storage loading uses this migration. API writes require the new,
    explicit field so an old or ambiguous request cannot enable a user.
    """
    legacy_fields = {"revision", "native_dashboard_gate", "device_control", "roles", "bindings"}
    if type(raw) is dict and set(raw) in (legacy_fields, legacy_fields | {"imported_applications"}) and type(raw["bindings"]) is dict:
        raw = deepcopy(raw)
        raw["enabled_users"] = list(raw["bindings"])
    previous_fields = {'revision','native_dashboard_gate','device_control','roles','bindings','enabled_users'}
    if type(raw) is dict and set(raw) == previous_fields:
        raw = deepcopy(raw)
        raw['imported_applications'] = []
    if type(raw) is dict and type(raw.get("roles")) is dict:
        raw = deepcopy(raw)
        for role in raw["roles"].values():
            if type(role) is dict:
                role.setdefault("dashboard_order", [])
                role.setdefault("applications", {})
    return _validate_legacy_policy(raw)


USER_PERMISSIONS = {
    'light_manager': {'view'},
    'rollladenplaner': {'view', 'control'},
    'essensplaner': {'view', 'plan'},
    'hausarbeiten_manager': {'view'},
    'gartenarbeit_manager': {'view'},
    'spuelmaschine_verlauf': {'view', 'confirm_own'},
    'music_manager': {'view', 'play', 'select_speaker', 'alarm_songs'},
    'wecker_manager': {'view', 'use_own'},
}


def default_app_roles():
    return {
        'admin': {'name': 'Admin', 'applications': {
            app: {key: True for key in descriptor['permissions']}
            for app, descriptor in APPLICATIONS.items()}},
        'user': {'name': 'Benutzer', 'applications': {
            app: {key: key in USER_PERMISSIONS[app] for key in descriptor['permissions']}
            for app, descriptor in APPLICATIONS.items()}},
    }


def default_policy():
    return {**_legacy_default_policy(), 'app_roles': default_app_roles(), 'app_bindings': {}, 'admin_presentations': {}}


def validate_policy(raw):
    """New API writes must explicitly separate presentation and application roles."""
    if type(raw) is not dict or not {'app_roles', 'app_bindings', 'admin_presentations'} <= raw.keys():
        raise InvalidPolicy('Darstellungen und App-Rollen müssen getrennt angegeben werden. Bitte neu laden.')
    checked = _validate_legacy_policy({k: v for k, v in raw.items() if k not in ('app_roles', 'app_bindings', 'admin_presentations')})
    if any(role['applications'] for role in checked['roles'].values()):
        raise InvalidPolicy('Darstellungen dürfen keine App-Rechte enthalten.')
    roles, bindings = raw['app_roles'], raw['app_bindings']
    if type(roles) is not dict or len(roles) > 700:
        raise InvalidPolicy('Zu viele oder ungültige App-Rollen.')
    for rid, role in roles.items():
        if not isinstance(rid, str) or not ROLE_ID.fullmatch(rid):
            raise InvalidPolicy('Ungültige App-Rollen-ID.')
        if type(role) is not dict or set(role) != {'name', 'applications'}:
            raise InvalidPolicy('App-Rollen dürfen nur Name und Anwendungsrechte enthalten.')
        # Reuse the same strict permission catalogue and name validation.
        probe = _legacy_default_policy()
        probe['roles'] = {rid: {**probe['roles']['family'], **deepcopy(role)}}
        _validate_legacy_policy(probe)
    if type(bindings) is not dict or len(bindings) > 500:
        raise InvalidPolicy('Ungültige App-Rollenzuordnung.')
    for uid, assigned in bindings.items():
        if (not isinstance(uid, str) or not 1 <= len(uid) <= 160
            or type(assigned) is not list or len(assigned) > 20
            or any(not isinstance(rid, str) or rid not in roles for rid in assigned)
            or len(assigned) != len(set(assigned))):
            raise InvalidPolicy('Eine App-Rollenzuordnung ist ungültig.')
    admin_presentations = raw['admin_presentations']
    if (type(admin_presentations) is not dict or len(admin_presentations) > 500
        or any(not isinstance(uid, str) or not 1 <= len(uid) <= 160
               or not isinstance(rid, str) or rid not in checked['roles']
               for uid, rid in admin_presentations.items())):
        raise InvalidPolicy('Ungültige Darstellungszuordnung für Administratoren.')
    if len(json.dumps(raw).encode()) > 250_000:
        raise InvalidPolicy('Die Rechtekonfiguration ist zu groß.')
    return {**checked, 'app_roles': deepcopy(roles), 'app_bindings': deepcopy(bindings), 'admin_presentations': deepcopy(admin_presentations)}


def migrate_policy(raw):
    """Split stored mixed roles once; preserve effective rights and explicit denial."""
    admin_presentations = deepcopy(raw.get('admin_presentations', {})) if type(raw) is dict else {}
    if type(raw) is dict:
        raw = {k: v for k, v in raw.items() if k != 'admin_presentations'}
    if type(raw) is dict and ('app_roles' in raw or 'app_bindings' in raw):
        base = _migrate_legacy_policy({k: v for k, v in raw.items() if k not in ('app_roles', 'app_bindings', 'admin_presentations')})
        return validate_policy({**base, **{k: v for k, v in raw.items() if k in ('app_roles', 'app_bindings')}, 'admin_presentations': admin_presentations})
    legacy = _migrate_legacy_policy(raw)
    result = {**deepcopy(legacy), 'app_roles': default_app_roles(), 'app_bindings': {}, 'admin_presentations': admin_presentations}
    def normalized(apps):
        return {app: {key: bool(grants.get(key, False)) for key in APPLICATIONS[app]['permissions']}
                for app, grants in apps.items()}
    def key(apps):
        return json.dumps(normalized(apps), sort_keys=True)
    indexed = {key(role['applications']): rid for rid, role in result['app_roles'].items()}
    def retain(apps):
        signature = key(apps)
        if signature in indexed:
            return indexed[signature]
        rid = 'legacy_' + hashlib.sha256(signature.encode()).hexdigest()[:20]
        result['app_roles'][rid] = {'name': 'Übernommene Rechte ' + str(len(indexed) - 1), 'applications': normalized(apps)}
        indexed[signature] = rid
        return rid
    # Keep staged but unassigned application grants available for later use.
    for role in legacy['roles'].values():
        if role['applications']:
            retain(role['applications'])
    for uid, assigned in legacy['bindings'].items():
        apps = {}
        for rid in assigned:
            for app, grants in legacy['roles'][rid]['applications'].items():
                combined = apps.setdefault(app, {})
                for permission, granted in grants.items():
                    combined[permission] = combined.get(permission, False) or granted
        if apps:
            result['app_bindings'][uid] = [retain(apps)]
    # Automatically imported app-only roles are no dashboard presentations.
    app_only = {rid for rid, role in legacy['roles'].items() if role['applications']
                and not any(role[part] for part in ('dashboards', 'entities', 'areas', 'labels'))}
    result['roles'] = {rid: {**role, 'applications': {}} for rid, role in result['roles'].items() if rid not in app_only}
    result['bindings'] = {uid: [rid for rid in assigned if rid not in app_only] for uid, assigned in result['bindings'].items()}
    return validate_policy(result)


class Policy:
    """Roles apply only to enabled users; an enabled empty binding denies all."""

    def __init__(self, config: dict):
        self.config = validate_policy(config)

    def privileged(self, user: Principal) -> bool:
        return user.is_active and (user.is_owner or user.is_admin)

    def managed(self, user: Principal) -> bool:
        return user.id in self.config["enabled_users"] and not self.privileged(user)

    def roles(self, user: Principal) -> list[dict]:
        if not user.is_active or not self.managed(user):
            return []
        return [self.config["roles"][r] for r in self.config["bindings"].get(user.id, [])]

    def presentation_managed(self, user: Principal) -> bool:
        if not user.is_active:
            return False
        if self.privileged(user):
            return user.id in self.config['admin_presentations']
        return self.managed(user)

    def presentation_roles(self, user: Principal) -> list[dict]:
        if not self.presentation_managed(user):
            return []
        if self.privileged(user):
            return [self.config['roles'][self.config['admin_presentations'][user.id]]]
        return self.roles(user)

    def presentation_dashboard(self, user: Principal, path: str) -> bool:
        return any(LEVELS[role['dashboards'].get(path, 'none')] > 0
                   for role in self.presentation_roles(user))

    def dashboard(self, user: Principal, path: str, level: str = "view") -> bool:
        if level not in LEVELS or level == "none" or not user.is_active:
            return False
        if self.privileged(user):
            return True
        # "lovelace" represents HA's default dashboard; never derive from Referer.
        return any(LEVELS[r["dashboards"].get(path, "none")] >= LEVELS[level] for r in self.roles(user))

    def entity(self, user: Principal, resource: Resource, level: str = "view") -> bool:
        if level not in ("view", "control") or not user.is_active:
            return False
        if self.privileged(user):
            return True
        for role in self.roles(user):
            grants = [role["entities"].get(resource.entity_id, "none")]
            if resource.area_id:
                grants.append(role["areas"].get(resource.area_id, "none"))
            grants.extend(role["labels"].get(label, "none") for label in resource.label_ids)
            if any(LEVELS[g] >= LEVELS[level] for g in grants):
                return True
        return False


    def application_permissions(self, user: Principal, application: str) -> dict:
        descriptor = APPLICATIONS.get(application)
        if descriptor is None or not user.is_active:
            return {}
        if self.privileged(user):
            return {key: True for key in descriptor['permissions']}
        roles = [self.config['app_roles'][rid] for rid in self.config['app_bindings'].get(user.id, [])]
        return {key: any(role['applications'].get(application, {}).get(key, False) for role in roles)
                for key in descriptor['permissions']}
