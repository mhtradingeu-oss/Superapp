import { publish } from "../../core/events/event-bus.js";
export var AdminEvents;
(function (AdminEvents) {
    AdminEvents["CREATED"] = "admin.created";
    AdminEvents["UPDATED"] = "admin.updated";
    AdminEvents["DELETED"] = "admin.deleted";
})(AdminEvents || (AdminEvents = {}));
export async function emitAdminCreated(payload) {
    await publish(AdminEvents.CREATED, payload);
}
