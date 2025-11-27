import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { FinanceEventPayload } from "./finance.types.js";

export enum FinanceEvents {
  CREATED = "finance.created",
  UPDATED = "finance.updated",
  DELETED = "finance.deleted",
}

export async function emitFinanceCreated(payload: FinanceEventPayload, context?: EventContext) {
  await publish(FinanceEvents.CREATED, payload, context);
}

export async function emitFinanceUpdated(payload: FinanceEventPayload, context?: EventContext) {
  await publish(FinanceEvents.UPDATED, payload, context);
}

export async function emitFinanceDeleted(payload: FinanceEventPayload, context?: EventContext) {
  await publish(FinanceEvents.DELETED, payload, context);
}
