"""Shared read-only vacation consumer protocol 1, independent of role protocol."""
from copy import deepcopy

DOMAIN = 'family_access_manager'
CLIENTS = 'family_access_vacation_clients'
EVENT = 'family_access_vacation_updated'
PROTOCOL = 1


def controller(hass):
    runtime = getattr(hass, 'data', {}).get(DOMAIN)
    return runtime.vacation if getattr(runtime, 'vacation_protocol', None) == PROTOCOL else None


def snapshot(hass, legacy, application=None):
    provider = controller(hass)
    if provider is not None:
        current=provider.snapshot()
        if application is None or application in current['imported']:
            return {**current, 'central': True}
    # The app persists its last confirmed state. An unavailable central provider
    # never turns an active pause off or invents a new vacation setting.
    return {**deepcopy(legacy), 'central': False, 'available': False}


def status(hass, legacy, application):
    state=snapshot(hass,legacy,application)
    return {key:state[key] for key in ('enabled','central','available')}


async def register(hass, application, legacy, notify, *, entry=None):
    from homeassistant.core import callback
    clients = hass.data.setdefault(CLIENTS, {})
    seed=deepcopy(legacy())
    record = {'legacy': lambda:deepcopy(seed)}
    clients[application] = record
    @callback
    def changed(event):
        notify()
    remove_listener = hass.bus.async_listen(EVENT, changed)
    try:
        provider = controller(hass)
        if provider is not None:
            await provider.import_legacy(application, seed)
    except Exception:
        remove_listener()
        if clients.get(application) is record:
            clients.pop(application, None)
        raise
    def remove():
        remove_listener()
        if clients.get(application) is record:
            clients.pop(application, None)
    if entry is not None and callable(getattr(entry, 'async_on_unload', None)):
        entry.async_on_unload(remove)
    return remove


async def set_via_service(hass, call):
    """Compatibility aliases retain HA's real caller context and central checks."""
    if controller(hass) is None:
        raise ValueError('Urlaubsmodus bitte zentral in Family Access 1.2.0 oder neuer einrichten.')
    await hass.services.async_call(DOMAIN, 'set_vacation', {'enabled': call.data['enabled']},
                                   blocking=True, context=call.context)
