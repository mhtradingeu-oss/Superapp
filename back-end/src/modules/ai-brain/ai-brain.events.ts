import { publish } from "../../core/events/event-bus.js";
import type { AiBrainEventPayload } from "./ai-brain.types.js";

export enum AiBrainEvents {
  CREATED = "ai-brain.created",
  UPDATED = "ai-brain.updated",
  DELETED = "ai-brain.deleted",
}

export async function emitAiBrainCreated(payload: AiBrainEventPayload) {
  await publish(AiBrainEvents.CREATED, payload);
}
