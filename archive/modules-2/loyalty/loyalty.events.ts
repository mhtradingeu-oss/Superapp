import { publish } from "../../core/events/event-bus.js";
import type { LoyaltyEventPayload } from "./loyalty.types.js";

export enum LoyaltyEvents {
  CREATED = "loyalty.created",
  UPDATED = "loyalty.updated",
  DELETED = "loyalty.deleted",
}

export async function emitLoyaltyCreated(payload: LoyaltyEventPayload) {
  await publish(LoyaltyEvents.CREATED, payload);
}
