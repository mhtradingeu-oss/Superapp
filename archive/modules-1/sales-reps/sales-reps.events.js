import { publish } from "../../core/events/event-bus.js";
export var SalesRepsEvents;
(function (SalesRepsEvents) {
    SalesRepsEvents["CREATED"] = "sales-reps.created";
    SalesRepsEvents["UPDATED"] = "sales-reps.updated";
    SalesRepsEvents["DELETED"] = "sales-reps.deleted";
})(SalesRepsEvents || (SalesRepsEvents = {}));
export async function emitSalesRepsCreated(payload) {
    await publish(SalesRepsEvents.CREATED, payload);
}
