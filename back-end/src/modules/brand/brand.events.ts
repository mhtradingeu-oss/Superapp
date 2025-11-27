import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { BrandCreatedPayload } from "./brand.types.js";

export enum BrandEvents {
  CREATED = "brand.created",
  UPDATED = "brand.updated",
  DELETED = "brand.deleted",
}

export async function emitBrandCreated(payload: BrandCreatedPayload, context?: EventContext) {
  await publish(BrandEvents.CREATED, payload, context);
}

export async function emitBrandUpdated(payload: BrandCreatedPayload, context?: EventContext) {
  await publish(BrandEvents.UPDATED, payload, context);
}

export async function emitBrandDeleted(payload: BrandCreatedPayload, context?: EventContext) {
  await publish(BrandEvents.DELETED, payload, context);
}
