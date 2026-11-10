"""A virtual switch for real control tests without operating home devices."""

from homeassistant.components.switch import SwitchEntity

from .const import DOMAIN


async def async_setup_entry(hass, entry, async_add_entities):
    async_add_entities([ProbeSwitch(hass.data[DOMAIN], entry.entry_id)])


class ProbeSwitch(SwitchEntity):
    _attr_name = "Family Access Testschalter"
    _attr_icon = "mdi:shield-check-outline"
    _attr_should_poll = False
    _attr_is_on = False

    def __init__(self, runtime, entry_id):
        self.runtime = runtime
        self._attr_unique_id = f"{entry_id}_probe"

    async def async_added_to_hass(self):
        await super().async_added_to_hass()
        self.runtime.probe_entity_id = self.entity_id

    async def async_will_remove_from_hass(self):
        self.runtime.probe_entity_id = None

    async def async_turn_on(self, **kwargs):
        self._attr_is_on = True
        self.async_write_ha_state()

    async def async_turn_off(self, **kwargs):
        self._attr_is_on = False
        self.async_write_ha_state()

