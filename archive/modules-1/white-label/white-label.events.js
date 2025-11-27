import { publish } from "../../core/events/event-bus.js";
export var WhiteLabelEvents;
(function (WhiteLabelEvents) {
    WhiteLabelEvents["CREATED"] = "white-label.created";
    WhiteLabelEvents["UPDATED"] = "white-label.updated";
    WhiteLabelEvents["DELETED"] = "white-label.deleted";
})(WhiteLabelEvents || (WhiteLabelEvents = {}));
export async function emitWhiteLabelCreated(payload) {
    await publish(WhiteLabelEvents.CREATED, payload);
}
