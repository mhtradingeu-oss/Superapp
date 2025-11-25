import { publish } from "../../core/events/event-bus.js";
import type { BrandCreatedPayload } from "./brand.types.js";

export enum BrandEvents {
  CREATED = "brand.created",
  UPDATED = "brand.updated",
  DELETED = "brand.deleted",
}

export async function emitBrandCreated(payload: BrandCreatedPayload) {
  await publish(BrandEvents.CREATED, payload);
}
