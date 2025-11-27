import { publish } from "../../core/events/event-bus.js";
export var CrmEvents;
(function (CrmEvents) {
    CrmEvents["CREATED"] = "crm.created";
    CrmEvents["UPDATED"] = "crm.updated";
    CrmEvents["DELETED"] = "crm.deleted";
})(CrmEvents || (CrmEvents = {}));
export async function emitCrmCreated(payload) {
    await publish(CrmEvents.CREATED, payload);
}
