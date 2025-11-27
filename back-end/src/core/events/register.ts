import { registerActivityLogSubscriber } from "../../modules/activity-log/activity-log.subscriber.js";
import { registerAutomationEventHandlers } from "../../modules/automation/automation.subscriber.js";
import { registerNotificationSubscribers } from "../../modules/notification/notification.subscriber.js";

let initialized = false;

export function initEventHub() {
  if (initialized) return;
  registerActivityLogSubscriber();
  registerAutomationEventHandlers();
  registerNotificationSubscribers();
  initialized = true;
}
