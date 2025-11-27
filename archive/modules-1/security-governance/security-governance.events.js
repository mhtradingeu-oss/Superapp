import { publish } from "../../core/events/event-bus.js";
export var SecurityGovernanceEvents;
(function (SecurityGovernanceEvents) {
    SecurityGovernanceEvents["CREATED"] = "security-governance.created";
    SecurityGovernanceEvents["UPDATED"] = "security-governance.updated";
    SecurityGovernanceEvents["DELETED"] = "security-governance.deleted";
})(SecurityGovernanceEvents || (SecurityGovernanceEvents = {}));
export async function emitSecurityGovernanceCreated(payload) {
    await publish(SecurityGovernanceEvents.CREATED, payload);
}
export async function emitSecurityGovernanceUpdated(payload) {
    await publish(SecurityGovernanceEvents.UPDATED, payload);
}
export async function emitSecurityGovernanceDeleted(payload) {
    await publish(SecurityGovernanceEvents.DELETED, payload);
}
