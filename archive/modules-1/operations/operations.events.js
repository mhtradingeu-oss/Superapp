import { publish } from "../../core/events/event-bus.js";
export var OperationsEvents;
(function (OperationsEvents) {
    OperationsEvents["CREATED"] = "operations.created";
    OperationsEvents["UPDATED"] = "operations.updated";
    OperationsEvents["DELETED"] = "operations.deleted";
})(OperationsEvents || (OperationsEvents = {}));
export async function emitOperationsCreated(payload) {
    await publish(OperationsEvents.CREATED, payload);
}
