import { publish } from "../../core/events/event-bus.js";
import type { SecurityGovernanceEventPayload } from "./security-governance.types.js";

export enum SecurityGovernanceEvents {
  CREATED = "security-governance.created",
  UPDATED = "security-governance.updated",
  DELETED = "security-governance.deleted",
}

export async function emitSecurityGovernanceCreated(payload: SecurityGovernanceEventPayload) {
  await publish(SecurityGovernanceEvents.CREATED, payload);
}

export async function emitSecurityGovernanceUpdated(payload: SecurityGovernanceEventPayload) {
  await publish(SecurityGovernanceEvents.UPDATED, payload);
}

export async function emitSecurityGovernanceDeleted(payload: SecurityGovernanceEventPayload) {
  await publish(SecurityGovernanceEvents.DELETED, payload);
}
