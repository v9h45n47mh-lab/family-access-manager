from copy import deepcopy

import pytest

from custom_components.family_access_manager.policy import InvalidPolicy, Policy, Principal, Resource, default_policy, validate_policy
from custom_components.family_access_manager.services import validate_service


@pytest.fixture
def config():
    c = default_policy()
    c["bindings"] = {"paul": ["family"]}
    c["roles"]["family"]["dashboards"] = {"dashboard-kids": "edit"}
    c["roles"]["family"]["entities"] = {"light.paul": "view"}
    c["roles"]["family"]["labels"] = {"paul": "control"}
    return c


def test_dashboard_edit_never_grants_entity_access(config):
    p = Policy(config)
    user = Principal("paul")
    assert p.dashboard(user, "dashboard-kids", "edit")
    assert not p.entity(user, Resource("lock.front_door"))
    assert not p.entity(user, Resource("light.paul"), "control")


def test_dynamic_labels_and_area(config):
    p = Policy(config)
    assert p.entity(Principal("paul"), Resource("light.new", label_ids=frozenset({"paul"})), "control")
    assert not p.entity(Principal("paul"), Resource("light.new"), "control")


@pytest.mark.parametrize("user", [Principal("owner", is_owner=True), Principal("admin", is_admin=True)])
def test_admin_and_owner_keep_access(config, user):
    p = Policy(config)
    assert p.dashboard(user, "anything", "edit")
    assert p.entity(user, Resource("lock.front"), "control")


def test_inactive_owner_is_denied(config):
    p = Policy(config)
    user = Principal("owner", is_owner=True, is_active=False)
    assert not p.dashboard(user, "anything")
    assert not p.entity(user, Resource("light.paul"))


def test_no_binding_own_api_denies_and_does_not_manage_native(config):
    p = Policy(config)
    user = Principal("stranger")
    assert not p.managed(user)
    assert not p.entity(user, Resource("light.paul"))


def test_empty_binding_manages_native_and_denies(config):
    config["bindings"]["paul"] = []
    p = Policy(config)
    assert p.managed(Principal("paul"))
    assert not p.dashboard(Principal("paul"), "dashboard-kids")


def test_roles_are_additive(config):
    config["roles"]["extra"] = deepcopy(config["roles"]["family"])
    config["roles"]["extra"]["entities"]["light.paul"] = "control"
    config["bindings"]["paul"].append("extra")
    assert Policy(config).entity(Principal("paul"), Resource("light.paul"), "control")


@pytest.mark.parametrize("mutate", [
    lambda c: c.update(native_dashboard_gate="false"),
    lambda c: c.update(revision=True),
    lambda c: c.update(is_admin=True),
    lambda c: c["bindings"].update(paul=["missing"]),
    lambda c: c["bindings"].update(paul=[{}]),
    lambda c: c["roles"]["family"]["entities"].update({"light.paul": "edit"}),
    lambda c: c["roles"]["family"]["dashboards"].update({"../private": "view"}),
    lambda c: c["roles"]["family"].update(name=""),
])
def test_invalid_policy_never_accepted(config, mutate):
    mutate(config)
    with pytest.raises(InvalidPolicy):
        validate_policy(config)


@pytest.mark.parametrize("payload", [
    {"domain": "homeassistant", "service": "restart", "entity_ids": ["switch.probe"], "data": {}},
    {"domain": "switch", "service": "toggle", "entity_ids": ["switch.probe"], "data": {"entity_id": "lock.front"}},
    {"domain": "switch", "service": "toggle", "entity_ids": [], "data": {}},
    {"domain": "switch", "service": "toggle", "entity_ids": ["light.paul"], "data": {}},
    {"domain": "light", "service": "turn_on", "entity_ids": ["light.paul"], "data": {"brightness_pct": float("nan")}},
    {"domain": "light", "service": "turn_on", "entity_ids": ["light.paul"], "data": {"brightness_pct": True}},
    {"domain": "light", "service": "turn_on", "entity_ids": ["light.paul"], "data": {"brightness_pct": "{{ 100 }}"}},
])
def test_unbounded_service_and_templates_rejected(payload):
    with pytest.raises(ValueError):
        validate_service(payload)

