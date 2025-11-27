import { publish } from "../../core/events/event-bus.js";
export var AutomationEvents;
(function (AutomationEvents) {
    AutomationEvents["CREATED"] = "automation.created";
    AutomationEvents["UPDATED"] = "automation.updated";
    AutomationEvents["DELETED"] = "automation.deleted";
})(AutomationEvents || (AutomationEvents = {}));
export async function emitAutomationCreated(payload) {
    await publish(AutomationEvents.CREATED, payload);
}
