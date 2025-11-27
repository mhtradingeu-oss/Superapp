import { publish } from "../../core/events/event-bus.js";
export var FinanceEvents;
(function (FinanceEvents) {
    FinanceEvents["CREATED"] = "finance.created";
    FinanceEvents["UPDATED"] = "finance.updated";
    FinanceEvents["DELETED"] = "finance.deleted";
})(FinanceEvents || (FinanceEvents = {}));
export async function emitFinanceCreated(payload) {
    await publish(FinanceEvents.CREATED, payload);
}
