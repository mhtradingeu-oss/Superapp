import { publish } from "../../core/events/event-bus.js";
import type { CrmEventPayload } from "./crm.types.js";

export enum CrmEvents {
  CREATED = "crm.created",
  UPDATED = "crm.updated",
  DELETED = "crm.deleted",
}

export async function emitCrmCreated(payload: CrmEventPayload) {
  await publish(CrmEvents.CREATED, payload);
}
