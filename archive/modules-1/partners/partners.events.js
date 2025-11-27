import { publish } from "../../core/events/event-bus.js";
export var PartnersEvents;
(function (PartnersEvents) {
    PartnersEvents["CREATED"] = "partners.created";
    PartnersEvents["UPDATED"] = "partners.updated";
    PartnersEvents["DELETED"] = "partners.deleted";
})(PartnersEvents || (PartnersEvents = {}));
export async function emitPartnersCreated(payload) {
    await publish(PartnersEvents.CREATED, payload);
}
