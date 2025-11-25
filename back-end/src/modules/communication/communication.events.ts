import { publish } from "../../core/events/event-bus.js";
import type { CommunicationEventPayload } from "./communication.types.js";

export enum CommunicationEvents {
  CREATED = "communication.created",
  UPDATED = "communication.updated",
  DELETED = "communication.deleted",
}

export async function emitCommunicationCreated(payload: CommunicationEventPayload) {
  await publish(CommunicationEvents.CREATED, payload);
}
