import { publish } from "../../core/events/event-bus.js";
export var AiBrainEvents;
(function (AiBrainEvents) {
    AiBrainEvents["CREATED"] = "ai-brain.created";
    AiBrainEvents["UPDATED"] = "ai-brain.updated";
    AiBrainEvents["DELETED"] = "ai-brain.deleted";
})(AiBrainEvents || (AiBrainEvents = {}));
export async function emitAiBrainCreated(payload) {
    await publish(AiBrainEvents.CREATED, payload);
}
