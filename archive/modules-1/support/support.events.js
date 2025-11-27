import { publish } from "../../core/events/event-bus.js";
export var SupportEvents;
(function (SupportEvents) {
    SupportEvents["CREATED"] = "support.created";
    SupportEvents["UPDATED"] = "support.updated";
    SupportEvents["DELETED"] = "support.deleted";
})(SupportEvents || (SupportEvents = {}));
export async function emitSupportCreated(payload) {
    await publish(SupportEvents.CREATED, payload);
}
