import { publish } from "../../core/events/event-bus.js";
export var LoyaltyEvents;
(function (LoyaltyEvents) {
    LoyaltyEvents["CREATED"] = "loyalty.created";
    LoyaltyEvents["UPDATED"] = "loyalty.updated";
    LoyaltyEvents["DELETED"] = "loyalty.deleted";
})(LoyaltyEvents || (LoyaltyEvents = {}));
export async function emitLoyaltyCreated(payload) {
    await publish(LoyaltyEvents.CREATED, payload);
}
