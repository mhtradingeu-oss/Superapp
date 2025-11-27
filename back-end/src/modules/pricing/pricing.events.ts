import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { PricingEventPayload } from "./pricing.types.js";

export enum PricingEvents {
  CREATED = "pricing.created",
  UPDATED = "pricing.updated",
  DELETED = "pricing.deleted",
  DRAFT_CREATED = "pricing.draft.created",
  COMPETITOR_RECORDED = "pricing.competitor.recorded",
  LOG_RECORDED = "pricing.log.recorded",
}

export async function emitPricingCreated(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.CREATED, payload, context);
}

export async function emitPricingUpdated(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.UPDATED, payload, context);
}

export async function emitPricingDeleted(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.DELETED, payload, context);
}

export async function emitPricingDraftCreated(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.DRAFT_CREATED, payload, context);
}

export async function emitCompetitorPriceRecorded(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.COMPETITOR_RECORDED, payload, context);
}

export async function emitPricingLogRecorded(payload: PricingEventPayload, context?: EventContext) {
  await publish(PricingEvents.LOG_RECORDED, payload, context);
}
