import { publish } from "../../core/events/event-bus.js";
export var CommunicationEvents;
(function (CommunicationEvents) {
    CommunicationEvents["CREATED"] = "communication.created";
    CommunicationEvents["UPDATED"] = "communication.updated";
    CommunicationEvents["DELETED"] = "communication.deleted";
})(CommunicationEvents || (CommunicationEvents = {}));
export async function emitCommunicationCreated(payload) {
    await publish(CommunicationEvents.CREATED, payload);
}
