import { publish } from "../../core/events/event-bus.js";
export var ProductEvents;
(function (ProductEvents) {
    ProductEvents["CREATED"] = "product.created";
    ProductEvents["UPDATED"] = "product.updated";
    ProductEvents["DELETED"] = "product.deleted";
})(ProductEvents || (ProductEvents = {}));
export async function emitProductCreated(payload) {
    await publish(ProductEvents.CREATED, payload);
}
