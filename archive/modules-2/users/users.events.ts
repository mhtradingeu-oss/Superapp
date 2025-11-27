import { publish } from "../../core/events/event-bus.js";

export enum UserEvents {
  CREATED = "user.created",
  UPDATED = "user.updated",
  DELETED = "user.deleted",
}

export async function emitUserCreated(payload: { id: string; email: string }) {
  await publish(UserEvents.CREATED, payload);
}

export async function emitUserUpdated(payload: { id: string; email: string }) {
  await publish(UserEvents.UPDATED, payload);
}

export async function emitUserDeleted(payload: { id: string; email: string }) {
  await publish(UserEvents.DELETED, payload);
}
