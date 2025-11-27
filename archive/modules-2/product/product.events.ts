import { publish } from "../../core/events/event-bus.js";
import type { ProductEventPayload } from "./product.types.js";

export enum ProductEvents {
  CREATED = "product.created",
  UPDATED = "product.updated",
  DELETED = "product.deleted",
}

export async function emitProductCreated(payload: ProductEventPayload) {
  await publish(ProductEvents.CREATED, payload);
}
