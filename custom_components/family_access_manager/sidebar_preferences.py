"""Use HA's native user stores and their live sidebar subscriptions."""

from copy import deepcopy
import hashlib
import json

from homeassistant.components.frontend.storage import async_system_store, async_user_store


def sidebar_data(store):
    value = store.data.get("sidebar")
    if value is None:
        return {}
    if type(value) is not dict:
        raise ValueError("Die HA-Seitenleisteneinstellungen sind ungültig.")
    for key in ("panelOrder", "hiddenPanels"):
        values = value.get(key, [])
        if type(values) is not list or not all(isinstance(path, str) for path in values):
            raise ValueError("Die HA-Seitenleisteneinstellungen sind ungültig.")
    return deepcopy(value)


def core_data(store):
    value = store.data.get("core")
    if value is None:
        return {}
    if type(value) is not dict:
        raise ValueError("Die HA-Profileinstellungen sind ungültig.")
    return deepcopy(value)


def fingerprint(store):
    """Only compare the settings we edit; never expose other frontend data."""
    raw = {"sidebar": store.data.get("sidebar"), "default_panel": core_data(store).get("default_panel")}
    return hashlib.sha256(json.dumps(raw, sort_keys=True).encode()).hexdigest()


def ordered_dashboards(role, catalog):
    known = {d["id"] for d in catalog if role["dashboards"].get(d["id"], "none") in {"view", "control", "edit"}}
    saved = [path for path in role["dashboard_order"] if path in known]
    return saved + [d["id"] for d in catalog if d["id"] in known and d["id"] not in saved]


def merge_order(old, ordered, dashboard_ids):
    """Replace dashboard slots; preserve the order of all other panels."""
    remaining = iter(ordered)
    result = []
    last_slot = None
    for path in old:
        if path in dashboard_ids:
            replacement = next(remaining, None)
            if replacement is not None:
                result.append(replacement)
            last_slot = len(result)
        elif path not in result:
            result.append(path)
    result[last_slot if last_slot is not None else 0:last_slot if last_slot is not None else 0] = list(remaining)
    return result


async def admin_sidebar(hass, user_id, catalog):
    store = await async_user_store(hass, user_id)
    sidebar = sidebar_data(store)
    system = await async_system_store(hass)
    default = core_data(store).get("default_panel") or core_data(system).get("default_panel") or "home"
    if not isinstance(default, str):
        raise ValueError("Die HA-Startseite ist ungültig.")
    return {
        "user_id": user_id, "token": fingerprint(store), "default_panel": default,
        "visible_dashboards": [d["id"] for d in catalog if d["id"] not in sidebar.get("hiddenPanels", [])],
    }


async def save_admin_sidebar(hass, user_id, visible, default, catalog):
    """Write only sidebar visibility and the explicitly selected start page.

    HA has one setter per key. Restore the original values if either write
    fails, and report failure rather than claiming that the update succeeded.
    """
    store = await async_user_store(hass, user_id)
    sidebar = sidebar_data(store)
    known = {d["id"] for d in catalog}
    sidebar["hiddenPanels"] = [p for p in sidebar.get("hiddenPanels", []) if p not in known] + [d["id"] for d in catalog if d["id"] not in visible]
    # Explicitly include visible dashboards, including HA default_visible=False.
    old_order = sidebar.get("panelOrder", [])
    sidebar["panelOrder"] = old_order + [d["id"] for d in catalog if d["id"] in visible and d["id"] not in old_order]
    before = {key: deepcopy(store.data.get(key)) for key in ("sidebar", "core")}
    core = core_data(store)
    core["default_panel"] = default
    try:
        await store.async_set_item("core", core)
        await store.async_set_item("sidebar", sidebar)
    except Exception:
        # async_set_item changes its in-memory value before attempting disk I/O.
        store.data.update(before)
        try:
            await store.async_set_item("core", before["core"])
            await store.async_set_item("sidebar", before["sidebar"])
        except Exception:
            store.data.update(before)
        raise


async def apply_order(hass, user_id, ordered, catalog):
    store = await async_user_store(hass, user_id)
    before = deepcopy(store.data.get("sidebar"))
    sidebar = sidebar_data(store)
    sidebar["panelOrder"] = merge_order(sidebar.get("panelOrder", []), ordered, set(ordered))
    try:
        await store.async_set_item("sidebar", sidebar)
    except Exception:
        store.data["sidebar"] = before
        raise
