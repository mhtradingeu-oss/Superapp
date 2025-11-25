import { publish } from "../../core/events/event-bus.js";
import type { SocialIntelligenceEventPayload } from "./social-intelligence.types.js";

export enum SocialIntelligenceEvents {
  CREATED = "social-intelligence.created",
  UPDATED = "social-intelligence.updated",
  DELETED = "social-intelligence.deleted",
}

export async function emitSocialIntelligenceCreated(payload: SocialIntelligenceEventPayload) {
  await publish(SocialIntelligenceEvents.CREATED, payload);
}
