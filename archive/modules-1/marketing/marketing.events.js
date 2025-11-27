import { publish } from "../../core/events/event-bus.js";
export var MarketingEvents;
(function (MarketingEvents) {
    MarketingEvents["CREATED"] = "marketing.created";
    MarketingEvents["UPDATED"] = "marketing.updated";
    MarketingEvents["DELETED"] = "marketing.deleted";
})(MarketingEvents || (MarketingEvents = {}));
export async function emitMarketingCreated(payload) {
    await publish(MarketingEvents.CREATED, payload);
}
