import { publish } from "../../core/events/event-bus.js";
export var PricingEvents;
(function (PricingEvents) {
    PricingEvents["CREATED"] = "pricing.created";
    PricingEvents["UPDATED"] = "pricing.updated";
    PricingEvents["DELETED"] = "pricing.deleted";
})(PricingEvents || (PricingEvents = {}));
export async function emitPricingCreated(payload) {
    await publish(PricingEvents.CREATED, payload);
}
