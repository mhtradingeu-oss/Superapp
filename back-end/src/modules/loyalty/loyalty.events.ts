import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { LoyaltyEventPayload } from "./loyalty.types.js";

export enum LoyaltyEvents {
  CREATED = "loyalty.created",
  UPDATED = "loyalty.updated",
  DELETED = "loyalty.deleted",
}

export async function emitLoyaltyCreated(payload: LoyaltyEventPayload, context?: EventContext) {
  await publish(LoyaltyEvents.CREATED, payload, context);
}

export async function emitLoyaltyUpdated(payload: LoyaltyEventPayload, context?: EventContext) {
  await publish(LoyaltyEvents.UPDATED, payload, context);
}

export async function emitLoyaltyDeleted(payload: LoyaltyEventPayload, context?: EventContext) {
  await publish(LoyaltyEvents.DELETED, payload, context);
}
