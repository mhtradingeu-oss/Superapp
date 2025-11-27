import { publish } from "../../core/events/event-bus.js";
export var AffiliateEvents;
(function (AffiliateEvents) {
    AffiliateEvents["CREATED"] = "affiliate.created";
    AffiliateEvents["UPDATED"] = "affiliate.updated";
    AffiliateEvents["DELETED"] = "affiliate.deleted";
})(AffiliateEvents || (AffiliateEvents = {}));
export async function emitAffiliateCreated(payload) {
    await publish(AffiliateEvents.CREATED, payload);
}
