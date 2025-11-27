import { publish, type EventContext } from "../../core/events/event-bus.js";
import type { CrmEventPayload } from "./crm.types.js";

export enum CrmEvents {
  CREATED = "crm.created",
  UPDATED = "crm.updated",
  DELETED = "crm.deleted",
}

export async function emitCrmCreated(payload: CrmEventPayload, context?: EventContext) {
  await publish(CrmEvents.CREATED, payload, context);
}

export async function emitCrmUpdated(payload: CrmEventPayload, context?: EventContext) {
  await publish(CrmEvents.UPDATED, payload, context);
}

export async function emitCrmDeleted(payload: CrmEventPayload, context?: EventContext) {
  await publish(CrmEvents.DELETED, payload, context);
}
