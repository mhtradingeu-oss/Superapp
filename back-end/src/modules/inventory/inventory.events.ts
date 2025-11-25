import { publish } from "../../core/events/event-bus.js";
import type { InventoryEventPayload } from "./inventory.types.js";

export enum InventoryEvents {
  CREATED = "inventory.created",
  UPDATED = "inventory.updated",
  DELETED = "inventory.deleted",
}

export async function emitInventoryCreated(payload: InventoryEventPayload) {
  await publish(InventoryEvents.CREATED, payload);
}
