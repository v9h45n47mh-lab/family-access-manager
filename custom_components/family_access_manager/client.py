"""Family Access application protocol 1. Same client in all participating apps.

No HA permissions or user objects are changed. Role grants are additional app
permissions; ownership, device checks and external account limits stay in force.
"""
from __future__ import annotations

PROTOCOL = 1
DOMAIN = 'family_access_manager'
CLIENTS = 'family_access_application_clients'


def configured(hass):
    entries = getattr(getattr(hass, 'config_entries', None), 'async_entries', None)
    return bool(entries and entries(DOMAIN))


def permissions(hass, user, application, legacy=None):
    if not user or not getattr(user, 'is_active', True) or getattr(user, 'system_generated', False):
        return {}
    provider = getattr(hass, 'data', {}).get(DOMAIN)
    if provider and getattr(provider, 'application_protocol', None) == PROTOCOL:
        return provider.application_permissions(user, application)
    # Once central access is configured, an unloaded/failed provider never
    # restores local administrative grants. HA admins retain recovery access.
    if getattr(user, 'is_admin', False) or getattr(user, 'is_owner', False):
        client = getattr(hass, 'data', {}).get(CLIENTS, {}).get(application, {})
        return {key: True for key in client.get('permissions', ())}
    if configured(hass):
        return {}
    if legacy is not None:
        return dict(legacy)
    client = getattr(hass, 'data', {}).get(CLIENTS, {}).get(application)
    return dict(client['legacy'](user)) if client else {}


def allows(hass, user, application, permission, legacy=None, *, audit=False):
    if not user or not getattr(user, 'is_active', True) or getattr(user, 'system_generated', False):
        return False
    if getattr(user, 'is_admin', False) or getattr(user, 'is_owner', False):
        return True
    granted = bool(permissions(hass, user, application, None if legacy is None else {permission: bool(legacy)}).get(permission, False))
    if not granted and audit:
        provider = getattr(hass, 'data', {}).get(DOMAIN)
        if provider and hasattr(provider, 'application_denied'):
            provider.application_denied(user, application, permission)
    return granted


def require(hass, user, application, permission, legacy=None):
    if not allows(hass, user, application, permission, legacy, audit=True):
        raise PermissionError('Diese Aktion ist für deine Rolle in Family Access nicht freigegeben.')


async def register(hass, application, keys, legacy, *, entry=None, notify=None):
    """Register an adapter and import its existing grants exactly once."""
    clients = hass.data.setdefault(CLIENTS, {})
    record={'permissions': tuple(keys), 'legacy': legacy}
    clients[application] = record
    provider = hass.data.get(DOMAIN)
    if provider and getattr(provider, 'application_protocol', None) == PROTOCOL:
        await provider.import_application(application, legacy)
    await _register_endpoint(hass)
    from homeassistant.core import callback
    @callback
    def changed(event):
        if notify:notify()
    unsubscribe=hass.bus.async_listen('family_access_manager_updated',changed) if notify else None
    def remove():
        if unsubscribe:unsubscribe()
        if clients.get(application) is record:
            clients.pop(application,None)
            hass.bus.async_fire('family_access_manager_updated',{})
    if entry is not None and callable(getattr(entry,"async_on_unload",None)):
        entry.async_on_unload(remove)
    return remove


async def _register_endpoint(hass):
    if hass.data.get(CLIENTS + '_endpoint'):
        return
    from homeassistant.components import websocket_api
    from homeassistant.core import callback
    try:
        import probatio as vol
    except ImportError:
        import voluptuous as vol

    @websocket_api.websocket_command({vol.Required('type'): 'family_access/application_permissions', vol.Required('application'): str})
    @websocket_api.async_response
    async def get_permissions(hass, connection, msg):
        application = msg['application']
        client = hass.data.get(CLIENTS, {}).get(application)
        if client is None:
            connection.send_error(msg['id'], 'not_loaded', 'Diese Anwendung ist nicht geladen.')
            return
        values = permissions(hass, connection.user, application)
        connection.send_result(msg['id'], {'permissions': {key: bool(values.get(key, False)) for key in client['permissions']},
                                          'central': bool(hass.data.get(DOMAIN)) or configured(hass)})
    @websocket_api.websocket_command({vol.Required('type'):'family_access/subscribe',vol.Required('application'):str})
    @websocket_api.async_response
    async def subscribe(hass,connection,msg):
        application=msg['application']
        if application not in hass.data.get(CLIENTS,{}):
            connection.send_error(msg['id'],'not_loaded','Diese Anwendung ist nicht geladen.')
            return
        @callback
        def update(event=None):
            client=hass.data.get(CLIENTS,{}).get(application,{})
            values=permissions(hass,connection.user,application) if client else {}
            connection.send_event(msg['id'],{'permissions':{key:bool(values.get(key,False)) for key in client.get('permissions',())},'central':bool(hass.data.get(DOMAIN)) or configured(hass)})
        connection.subscriptions[msg['id']]=hass.bus.async_listen('family_access_manager_updated',update)
        update()
        connection.send_result(msg['id'])
    websocket_api.async_register_command(hass, subscribe)
    websocket_api.async_register_command(hass, get_permissions)
    hass.data[CLIENTS + '_endpoint'] = True
