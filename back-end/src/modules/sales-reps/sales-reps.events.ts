import { publish } from "../../core/events/event-bus.js";
import type { SalesRepsEventPayload } from "./sales-reps.types.js";

export enum SalesRepsEvents {
  CREATED = "sales-reps.created",
  UPDATED = "sales-reps.updated",
  DELETED = "sales-reps.deleted",
}

export async function emitSalesRepsCreated(payload: SalesRepsEventPayload) {
  await publish(SalesRepsEvents.CREATED, payload);
}
