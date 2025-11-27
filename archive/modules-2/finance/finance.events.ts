import { publish } from "../../core/events/event-bus.js";
import type { FinanceEventPayload } from "./finance.types.js";

export enum FinanceEvents {
  CREATED = "finance.created",
  UPDATED = "finance.updated",
  DELETED = "finance.deleted",
}

export async function emitFinanceCreated(payload: FinanceEventPayload) {
  await publish(FinanceEvents.CREATED, payload);
}
