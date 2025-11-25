import { publish } from "../../core/events/event-bus.js";
import type { MarketingEventPayload } from "./marketing.types.js";

export enum MarketingEvents {
  CREATED = "marketing.created",
  UPDATED = "marketing.updated",
  DELETED = "marketing.deleted",
}

export async function emitMarketingCreated(payload: MarketingEventPayload) {
  await publish(MarketingEvents.CREATED, payload);
}
