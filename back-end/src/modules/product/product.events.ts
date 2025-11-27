import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { ProductEventPayload } from "./product.types.js";

export enum ProductEvents {
  CREATED = "product.created",
  UPDATED = "product.updated",
  DELETED = "product.deleted",
}

export async function emitProductCreated(payload: ProductEventPayload, context?: EventContext) {
  await publish(ProductEvents.CREATED, payload, context);
}

export async function emitProductUpdated(payload: ProductEventPayload, context?: EventContext) {
  await publish(ProductEvents.UPDATED, payload, context);
}

export async function emitProductDeleted(payload: ProductEventPayload, context?: EventContext) {
  await publish(ProductEvents.DELETED, payload, context);
}
