"""Conservative, explicit service calls for the prototype API."""

import math

SERVICES = {
    "switch": {"turn_on": set(), "turn_off": set(), "toggle": set()},
    "input_boolean": {"turn_on": set(), "turn_off": set(), "toggle": set()},
    "light": {"turn_on": {"brightness_pct"}, "turn_off": set(), "toggle": set()},
    "cover": {"open_cover": set(), "close_cover": set(), "stop_cover": set(), "set_cover_position": {"position"}},
}


def validate_service(payload: dict) -> tuple[str, str, list[str], dict]:
    if type(payload) is not dict or set(payload) != {"domain", "service", "entity_ids", "data"}:
        raise ValueError("Bitte Domain, Aktion, Entitäten und Parameter angeben.")
    domain, service, targets, data = (payload[k] for k in ("domain", "service", "entity_ids", "data"))
    if not isinstance(domain, str) or not isinstance(service, str) or service not in SERVICES.get(domain, {}):
        raise ValueError("Diese Aktion ist in der Prüfversion nicht freigegeben.")
    if type(targets) is not list or not 1 <= len(targets) <= 20 or not all(isinstance(t, str) and t.startswith(domain + ".") for t in targets):
        raise ValueError("Bitte 1–20 Entitäten derselben Domain auswählen.")
    if len(set(targets)) != len(targets):
        raise ValueError("Entitäten dürfen nicht doppelt angegeben werden.")
    if type(data) is not dict or not set(data) <= SERVICES[domain][service]:
        raise ValueError("Nicht erlaubte Aktionsparameter.")
    for key, value in data.items():
        if type(value) not in (int, float) or not math.isfinite(value) or not 0 <= value <= 100:
            raise ValueError("Position und Helligkeit müssen zwischen 0 und 100 liegen.")
    if service == "set_cover_position" and "position" not in data:
        raise ValueError("Bitte eine Position angeben.")
    return domain, service, targets, data

