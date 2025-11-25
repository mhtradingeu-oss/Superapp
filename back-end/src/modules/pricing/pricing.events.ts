import { publish } from "../../core/events/event-bus.js";
import type { PricingEventPayload } from "./pricing.types.js";

export enum PricingEvents {
  CREATED = "pricing.created",
  UPDATED = "pricing.updated",
  DELETED = "pricing.deleted",
}

export async function emitPricingCreated(payload: PricingEventPayload) {
  await publish(PricingEvents.CREATED, payload);
}
