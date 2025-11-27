import { publish } from "../../core/events/event-bus.js";
export var StandEvents;
(function (StandEvents) {
    StandEvents["CREATED"] = "stand.created";
    StandEvents["UPDATED"] = "stand.updated";
    StandEvents["DELETED"] = "stand.deleted";
})(StandEvents || (StandEvents = {}));
export async function emitStandCreated(payload) {
    await publish(StandEvents.CREATED, payload);
}
