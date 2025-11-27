import { publish } from "../../core/events/event-bus.js";
import type { DealersEventPayload } from "./dealers.types.js";

export enum DealersEvents {
  CREATED = "dealers.created",
  UPDATED = "dealers.updated",
  DELETED = "dealers.deleted",
}

export async function emitDealersCreated(payload: DealersEventPayload) {
  await publish(DealersEvents.CREATED, payload);
}
