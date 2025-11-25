import { publish } from "../../core/events/event-bus.js";
import type { KnowledgeBaseEventPayload } from "./knowledge-base.types.js";

export enum KnowledgeBaseEvents {
  CREATED = "knowledge-base.created",
  UPDATED = "knowledge-base.updated",
  DELETED = "knowledge-base.deleted",
}

export async function emitKnowledgeBaseCreated(payload: KnowledgeBaseEventPayload) {
  await publish(KnowledgeBaseEvents.CREATED, payload);
}
