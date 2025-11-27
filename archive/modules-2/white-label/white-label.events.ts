import { publish } from "../../core/events/event-bus.js";
import type { WhiteLabelEventPayload } from "./white-label.types.js";

export enum WhiteLabelEvents {
  CREATED = "white-label.created",
  UPDATED = "white-label.updated",
  DELETED = "white-label.deleted",
}

export async function emitWhiteLabelCreated(payload: WhiteLabelEventPayload) {
  await publish(WhiteLabelEvents.CREATED, payload);
}
