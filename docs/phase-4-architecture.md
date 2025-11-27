## Phase 4 Foundations (Backend + Admin UX)

### Event Hub & Activity Log
- Added a typed event bus with envelopes (id, payload, context, timestamp) and wildcard subscriptions.
- Activity log subscriber captures all events to `ActivityLog` table for brand/user/module visibility.
- Notifications subscribe to key events (pricing, product, user, AI) to surface operational alerts without blocking flows.
- Automation listeners react to every event to evaluate matching rules and fire actions.

### Automation Engine
- Prisma schema expanded with richer `AutomationRule` fields (trigger type/config, condition/action configs, audit fields) and `AutomationExecutionLog`.
- Rules can be triggered by events or schedules, evaluate simple JSON conditions, and run actions such as in-app notifications.
- REST endpoints: CRUD, run-now, run-scheduled hook for cron callers.

### Notification Center
- Backend module for listing/marking notifications, with status/readAt and JSON payloads.
- Front-end bell + dropdown in the shell, notifications page with filters and mark-as-read controls.

### Activity, CRM, Marketing, Loyalty, Finance
- Minimal but usable CRUD/service flows wired to Prisma:
  - CRM leads (auto-create person, status updates, events emitted).
  - Campaigns (marketing), loyalty customers/points adjustments, finance revenue records.
- Admin UI pages for each to list/edit core fields and tie into automations/notifications.

### Admin UX Touches
- Sidebar gains Ops section (Notifications, Activity, Automations, CRM, Marketing, Loyalty, Finance).
- Automation builder MVP with JSON editors and run-now.
- Finance overview + CRM/Marketing/Loyalty tables reuse shared UI patterns.

### Running Checks
- Backend: `cd back-end && npm run build && npx prisma validate`
- Front-end: `cd front-end && npx tsc --noEmit && npm run build`
