import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { MarketingEventPayload } from "./marketing.types.js";

export enum MarketingEvents {
  CREATED = "marketing.created",
  UPDATED = "marketing.updated",
  DELETED = "marketing.deleted",
}

export async function emitMarketingCreated(payload: MarketingEventPayload, context?: EventContext) {
  await publish(MarketingEvents.CREATED, payload, context);
}

export async function emitMarketingUpdated(payload: MarketingEventPayload, context?: EventContext) {
  await publish(MarketingEvents.UPDATED, payload, context);
}

export async function emitMarketingDeleted(payload: MarketingEventPayload, context?: EventContext) {
  await publish(MarketingEvents.DELETED, payload, context);
}
