"""Durable household vacation state; the only writer for participating apps."""
from __future__ import annotations

import asyncio
from copy import deepcopy
from datetime import date, timedelta
import re

from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

EVENT = 'family_access_vacation_updated'
CLIENTS = 'family_access_vacation_clients'
PROTOCOL = 1
SOURCES = {'light_manager': 'Light Manager', 'rollladenplaner': 'Shutter Manager',
           'hausarbeiten_manager': 'Hausarbeiten'}


def today():
    return dt_util.as_local(dt_util.utcnow()).date()


def periods(values):
    """Union closed historical intervals without shifting recurring schedules."""
    if type(values) is not list:
        raise ValueError('Ungültige Urlaubszeiträume.')
    spans = []
    for value in values:
        if type(value) is not dict or not {'start', 'end'} <= value.keys():
            raise ValueError('Ungültiger Urlaubszeitraum.')
        start, end = date.fromisoformat(value['start']), date.fromisoformat(value['end'])
        if end < start:
            raise ValueError('Ungültiger Urlaubszeitraum.')
        spans.append((start, end))
    result = []
    for start, end in sorted(spans):
        if result and start.toordinal() <= result[-1][1].toordinal() + 1:
            result[-1] = (result[-1][0], max(result[-1][1], end))
        else:
            result.append((start, end))
    return [{'start': a.isoformat(), 'end': b.isoformat()} for a, b in result]


class Vacation:
    def __init__(self, hass):
        self.hass = hass
        self.store = Store(hass, 1, 'family_access_manager_vacation')
        self.lock = asyncio.Lock()
        self.data = {'revision': 0, 'enabled': False, 'started': None,
                     'periods': [], 'imported': [], 'managed': False}

    async def load(self):
        value = await self.store.async_load()
        if value is None:
            return
        if (type(value) is not dict or set(value) != set(self.data)
            or type(value['revision']) is not int or value['revision'] < 0
            or type(value['enabled']) is not bool or type(value['managed']) is not bool
            or type(value['imported']) is not list
            or any(not isinstance(s, str) or not re.fullmatch(r'[a-z0-9_]{1,80}', s) for s in value['imported'])
            or len(set(value['imported'])) != len(value['imported'])):
            raise ValueError('Der gespeicherte zentrale Urlaubsmodus ist ungültig.')
        if value['enabled']:
            date.fromisoformat(value['started'])
        elif value['started'] is not None:
            raise ValueError('Ungültiger Beginn des Urlaubsmodus.')
        normalized = periods(value['periods'])
        self.data = {**deepcopy(value), 'periods': normalized}

    def snapshot(self):
        return {**deepcopy(self.data), 'available': True,
                'consumers': [{'id': key, 'name': name,
                               'connected': key in self.hass.data.get(CLIENTS, {})}
                              for key, name in SOURCES.items()]}

    async def commit(self, candidate):
        candidate['revision'] = self.data['revision'] + 1
        await self.store.async_save(candidate)
        self.data = candidate
        self.hass.bus.async_fire(EVENT, {'revision': candidate['revision']})

    async def set(self, enabled, revision=None):
        if type(enabled) is not bool or (revision is not None and type(revision) is not int):
            raise ValueError('Bitte einen gültigen Urlaubsmodus angeben.')
        async with self.lock:
            if revision is not None and revision != self.data['revision']:
                raise ValueError('Der Urlaubsmodus wurde zwischenzeitlich geändert. Bitte erneut prüfen.')
            candidate = deepcopy(self.data)
            candidate['managed'] = True
            if enabled and not candidate['enabled']:
                candidate['started'] = today().isoformat()
            elif not enabled and candidate['enabled']:
                first, last = date.fromisoformat(candidate['started']), today() - timedelta(days=1)
                if first <= last:
                    candidate['periods'] = periods([*candidate['periods'], {'start': first.isoformat(), 'end': last.isoformat()}])
                candidate['started'] = None
            candidate['enabled'] = enabled
            if candidate != self.data:
                await self.commit(candidate)
            return self.snapshot()

    async def import_legacy(self, source, legacy):
        """Import each source once; a deliberate central choice always wins."""
        if not re.fullmatch(r'[a-z0-9_]{1,80}', source) or type(legacy.get('enabled')) is not bool:
            raise ValueError('Ungültige Quelle für den Urlaubsmodus.')
        async with self.lock:
            if source in self.data['imported']:
                return
            candidate = deepcopy(self.data)
            # Keep closed household pauses even if an administrator has already
            # selected the current central mode; history cannot change that choice.
            old_periods = periods(legacy.get('periods', []))
            candidate['periods'] = periods([*candidate['periods'], *old_periods])
            if not candidate['managed'] and legacy['enabled']:
                started = legacy.get('started') or today().isoformat()
                started=date.fromisoformat(started).isoformat()
                if date.fromisoformat(started)>today():raise ValueError('Ein aktiver Urlaub kann nicht in der Zukunft beginnen.')
                candidate['started'] = min(candidate['started'] or started, started)
                candidate['enabled'] = True
            candidate['imported'].append(source)
            await self.commit(candidate)


def register_service(hass):
    """Session identity comes from HA context; trusted automations may also set it."""
    from homeassistant.exceptions import ServiceValidationError
    try:
        import probatio as vol
    except ImportError:
        import voluptuous as vol

    async def set_vacation(call):
        runtime = hass.data.get('family_access_manager')
        if runtime is None:
            raise ServiceValidationError('Family Access ist nicht geladen.')
        if call.context.user_id:
            user = await hass.auth.async_get_user(call.context.user_id)
            if not user:
                raise ServiceValidationError('Keine gültige Anmeldung.')
            from .runtime import AccessDenied
            try:
                await runtime.dispatch(user, 'set_vacation', {'enabled': call.data['enabled']}, source='service')
            except (AccessDenied, ValueError) as err:
                raise ServiceValidationError(str(err)) from err
        else:
            await runtime.vacation.set(call.data['enabled'])
    hass.services.async_register('family_access_manager', 'set_vacation', set_vacation,
                                 schema=vol.Schema({vol.Required('enabled'): bool}))
