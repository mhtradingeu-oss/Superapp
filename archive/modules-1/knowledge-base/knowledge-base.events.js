import { publish } from "../../core/events/event-bus.js";
export var KnowledgeBaseEvents;
(function (KnowledgeBaseEvents) {
    KnowledgeBaseEvents["CREATED"] = "knowledge-base.created";
    KnowledgeBaseEvents["UPDATED"] = "knowledge-base.updated";
    KnowledgeBaseEvents["DELETED"] = "knowledge-base.deleted";
})(KnowledgeBaseEvents || (KnowledgeBaseEvents = {}));
export async function emitKnowledgeBaseCreated(payload) {
    await publish(KnowledgeBaseEvents.CREATED, payload);
}
