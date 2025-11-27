import { publish } from "../../core/events/event-bus.js";
export var BrandEvents;
(function (BrandEvents) {
    BrandEvents["CREATED"] = "brand.created";
    BrandEvents["UPDATED"] = "brand.updated";
    BrandEvents["DELETED"] = "brand.deleted";
})(BrandEvents || (BrandEvents = {}));
export async function emitBrandCreated(payload) {
    await publish(BrandEvents.CREATED, payload);
}
