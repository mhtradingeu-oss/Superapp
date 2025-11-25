import { EventEmitter } from "events";

export type AppEvent = {
  name: string;
  payload: Record<string, unknown>;
};

class EventBus extends EventEmitter {
  emitEvent(event: AppEvent) {
    this.emit(event.name, event.payload);
  }
}

export const eventBus = new EventBus();
