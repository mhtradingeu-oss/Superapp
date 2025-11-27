import { publish } from "../../core/events/event-bus.js";
export var SocialIntelligenceEvents;
(function (SocialIntelligenceEvents) {
    SocialIntelligenceEvents["CREATED"] = "social-intelligence.created";
    SocialIntelligenceEvents["UPDATED"] = "social-intelligence.updated";
    SocialIntelligenceEvents["DELETED"] = "social-intelligence.deleted";
})(SocialIntelligenceEvents || (SocialIntelligenceEvents = {}));
export async function emitSocialIntelligenceCreated(payload) {
    await publish(SocialIntelligenceEvents.CREATED, payload);
}
