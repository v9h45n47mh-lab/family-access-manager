"""Installation smoke test with HA's actual loader, frontend and switch platform."""

from copy import deepcopy

from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.family_access_manager.const import DOMAIN
from custom_components.family_access_manager.policy import Policy


async def test_entry_setup_probe_control_and_unload(hass, enable_custom_integrations, child):
    entry = MockConfigEntry(domain=DOMAIN, data={}, unique_id=DOMAIN)
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    runtime = hass.data[DOMAIN]
    assert runtime.gate.available
    assert runtime.probe_entity_id is not None
    assert hass.states.get(runtime.probe_entity_id).state == "off"
    config = deepcopy(runtime.policy.config)
    config["bindings"][child[0].id] = ["family"]
    config["roles"]["family"]["entities"][runtime.probe_entity_id] = "control"
    runtime.policy = Policy(config)
    await runtime.dispatch(child[0], "call_service", {
        "domain": "switch", "service": "toggle",
        "entity_ids": [runtime.probe_entity_id], "data": {},
    })
    assert hass.states.get(runtime.probe_entity_id).state == "on"
    gate = runtime.gate
    assert await hass.config_entries.async_unload(entry.entry_id)
    assert DOMAIN not in hass.data
    assert not gate.available


async def test_single_config_flow(hass, enable_custom_integrations):
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": "user"})
    assert result["type"] == "form"
    assert result["step_id"] == "user"

