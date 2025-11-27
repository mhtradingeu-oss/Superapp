import { publish } from "../../core/events/event-bus.js";
import type { AffiliateEventPayload } from "./affiliate.types.js";

export enum AffiliateEvents {
  CREATED = "affiliate.created",
  UPDATED = "affiliate.updated",
  DELETED = "affiliate.deleted",
}

export async function emitAffiliateCreated(payload: AffiliateEventPayload) {
  await publish(AffiliateEvents.CREATED, payload);
}
