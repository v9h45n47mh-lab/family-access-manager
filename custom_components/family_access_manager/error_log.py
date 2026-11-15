"""Bounded, admin-only diagnostics. Never store request bodies or credentials."""

from collections import deque
from copy import deepcopy
from datetime import UTC, datetime
import logging
import re

from homeassistant.helpers.storage import Store

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)
ERROR_LOG_LIMIT = 200
FIELDS = {"time", "user_id", "user_name", "operation", "target", "reason", "source", "kind"}
_ENTITY = re.compile(r"^[a-z0-9_]+\.[a-z0-9_]+$")
_DASHBOARD = re.compile(r"^[a-zA-Z0-9_-]{1,160}$")


def safe_text(value, limit=160):
    return " ".join(str(value or "").split())[:limit]


def request_target(action, payload):
    """Whitelist resource identifiers; never copy service data or raw payloads."""
    if not isinstance(payload, dict):
        return "Anfrage"
    if action == "read_entity":
        value = payload.get("entity_id")
        return value if isinstance(value, str) and len(value) <= 160 and _ENTITY.fullmatch(value) else "Entität"
    if action == "read_dashboard":
        value = payload.get("url_path")
        return value if isinstance(value, str) and _DASHBOARD.fullmatch(value) else "Dashboard"
    if action == "call_service":
        values = payload.get("entity_ids", [])
        if isinstance(values, list):
            return safe_text(", ".join(v for v in values[:5] if isinstance(v, str) and _ENTITY.fullmatch(v))) or "Geräteaktion"
    return "Verwaltung" if action in {"save_policy", "admin_snapshot", "admin_error_log"} else "Anfrage"


class PermissionErrorLog:
    def __init__(self, hass):
        self.store = Store(hass, 1, f"{DOMAIN}_errors", serialize_in_event_loop=True)
        self.events = deque(maxlen=ERROR_LOG_LIMIT)

    async def load(self):
        try:
            saved = await self.store.async_load()
            if saved is None:
                return
            if not isinstance(saved, dict) or not isinstance(saved.get("events"), list):
                raise ValueError("Invalid diagnostic format")
            clean = [e for e in saved["events"][:ERROR_LOG_LIMIT]
                     if isinstance(e, dict) and set(e) == FIELDS and all(isinstance(v, str) for v in e.values())]
            self.events = deque(({k: safe_text(v, 500 if k == "reason" else 160) for k, v in e.items()} for e in clean), maxlen=ERROR_LOG_LIMIT)
        except Exception:
            # Diagnostics must never disable or widen the permission policy.
            _LOGGER.error("Gespeichertes Family-Access-Fehlerprotokoll konnte nicht geladen werden")

    def snapshot(self):
        return deepcopy(list(self.events))

    def record(self, user, operation, target, reason, *, source="internal", kind="denied"):
        entry = {
            "time": datetime.now(UTC).isoformat(),
            "user_id": safe_text(user.id), "user_name": safe_text(getattr(user, "name", None) or user.id),
            "operation": safe_text(operation), "target": safe_text(target),
            "reason": safe_text(reason, 500), "source": safe_text(source), "kind": safe_text(kind),
        }
        self.events.appendleft(entry)
        _LOGGER.warning("Family Access %s: Benutzer=%s Aktion=%s Ziel=%s Grund=%s",
                        entry["kind"], entry["user_id"], entry["operation"], entry["target"], entry["reason"])
        try:
            self.store.async_delay_save(lambda: {"events": self.snapshot()}, 5)
        except Exception:
            _LOGGER.error("Family-Access-Fehlerprotokoll konnte nicht zum Speichern vorgemerkt werden")

    async def flush(self):
        try:
            await self.store.async_save({"events": self.snapshot()})
        except Exception:
            _LOGGER.error("Family-Access-Fehlerprotokoll konnte nicht gespeichert werden")
