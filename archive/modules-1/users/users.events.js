import { publish } from "../../core/events/event-bus.js";
export var UserEvents;
(function (UserEvents) {
    UserEvents["CREATED"] = "user.created";
    UserEvents["UPDATED"] = "user.updated";
    UserEvents["DELETED"] = "user.deleted";
})(UserEvents || (UserEvents = {}));
export async function emitUserCreated(payload) {
    await publish(UserEvents.CREATED, payload);
}
export async function emitUserUpdated(payload) {
    await publish(UserEvents.UPDATED, payload);
}
export async function emitUserDeleted(payload) {
    await publish(UserEvents.DELETED, payload);
}
