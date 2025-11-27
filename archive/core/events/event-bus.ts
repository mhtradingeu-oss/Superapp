import { EventEmitter } from "events";

export type EventHandler = (payload: unknown) => Promise<void> | void;

const bus = new EventEmitter();

export async function publish(eventName: string, payload: unknown): Promise<void> {
  bus.emit(eventName, payload);
}

export function subscribe(eventName: string, handler: EventHandler): void {
  bus.on(eventName, (payload) => {
    void handler(payload);
  });
}
