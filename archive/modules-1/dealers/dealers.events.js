import { publish } from "../../core/events/event-bus.js";
export var DealersEvents;
(function (DealersEvents) {
    DealersEvents["CREATED"] = "dealers.created";
    DealersEvents["UPDATED"] = "dealers.updated";
    DealersEvents["DELETED"] = "dealers.deleted";
})(DealersEvents || (DealersEvents = {}));
export async function emitDealersCreated(payload) {
    await publish(DealersEvents.CREATED, payload);
}
