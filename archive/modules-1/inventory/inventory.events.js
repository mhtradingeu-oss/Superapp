import { publish } from "../../core/events/event-bus.js";
export var InventoryEvents;
(function (InventoryEvents) {
    InventoryEvents["CREATED"] = "inventory.created";
    InventoryEvents["UPDATED"] = "inventory.updated";
    InventoryEvents["DELETED"] = "inventory.deleted";
})(InventoryEvents || (InventoryEvents = {}));
export async function emitInventoryCreated(payload) {
    await publish(InventoryEvents.CREATED, payload);
}
