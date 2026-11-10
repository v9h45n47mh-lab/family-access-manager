"""Identical authorization for HA HTTP and WebSocket requests."""

import logging

from aiohttp import web

from homeassistant.components import websocket_api
if type(websocket_api.BASE_COMMAND_MESSAGE_SCHEMA).__module__.startswith("probatio"):
    import probatio as schema_lib
else:
    import voluptuous as schema_lib
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.http import HomeAssistantView

from .const import DOMAIN, MAX_POLICY_BYTES
from .policy import InvalidPolicy
from .runtime import AccessDenied, Conflict

_LOGGER = logging.getLogger(__name__)


async def execute(hass, user, action, payload):
    runtime = hass.data.get(DOMAIN)
    if runtime is None:
        return None, ("unavailable", "Family Access Manager ist nicht geladen.", 503)
    try:
        return await runtime.dispatch(user, action, payload), None
    except AccessDenied as err:
        return None, ("unauthorized", str(err), 403)
    except Conflict as err:
        return None, ("conflict", str(err), 409)
    except (InvalidPolicy, ValueError, TypeError) as err:
        return None, ("invalid_request", str(err), 400)
    except HomeAssistantError:
        return None, ("ha_error", "Home Assistant konnte die Anfrage nicht ausführen.", 400)
    except Exception:
        _LOGGER.exception("Family Access Manager operation failed")
        return None, ("internal_error", "Die Anfrage konnte nicht ausgeführt werden.", 500)


class RequestView(HomeAssistantView):
    url = "/api/family_access_manager/request"
    name = "api:family_access_manager:request"
    requires_auth = True

    async def post(self, request):
        # Read a bounded body without trusting Content-Length/chunked framing.
        chunks, size = [], 0
        async for chunk in request.content.iter_chunked(16_384):
            size += len(chunk)
            if size > MAX_POLICY_BYTES:
                return self.json({"error": "request_too_large"}, status_code=413)
            chunks.append(chunk)
        body = b"".join(chunks)
        import json
        try:
            msg = json.loads(body)
        except (ValueError, UnicodeDecodeError):
            return self.json({"error": "invalid_request"}, status_code=400)
        if type(msg) is not dict or set(msg) != {"action", "payload"} or not isinstance(msg["action"], str):
            return self.json({"error": "invalid_request"}, status_code=400)
        from homeassistant.helpers.http import KEY_HASS
        result, error = await execute(request.app[KEY_HASS], request["hass_user"], msg["action"], msg["payload"])
        if error:
            return self.json({"error": error[0], "message": error[1]}, status_code=error[2])
        return self.json({"result": result})


@websocket_api.websocket_command({
    "type": "family_access_manager/request",
    schema_lib.Required("action"): str,
    schema_lib.Optional("payload", default={}): dict,
})
@websocket_api.async_response
async def websocket_request(hass, connection, msg):
    import json
    if len(json.dumps(msg).encode()) > MAX_POLICY_BYTES:
        connection.send_error(msg["id"], "request_too_large", "Die Anfrage ist zu groß.")
        return
    result, error = await execute(hass, connection.user, msg["action"], msg["payload"])
    if error:
        connection.send_error(msg["id"], error[0], error[1])
    else:
        connection.send_result(msg["id"], result)

