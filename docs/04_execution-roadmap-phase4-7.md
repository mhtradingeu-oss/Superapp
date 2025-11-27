# Execution Roadmap (Phase 4.1 → Phase 7)

## Phase 4.1 – Admin UX Hardening
- **Backend**
  - Stabilize pricing module: expand logging hooks, surface competitor data and margin calculations as part of `ProductPricing` records without schema change.
  - Ensure AI insights (kpi summary, ai narrative) have consistent scopes (brand + module) to feed dashboard cards.
- **Admin Frontend**
  - Improve pricing page: structured fields for costs/fees, margin calculations, guardrail badges, AI suggestion drawer, history timeline with diff.
  - Solidify marketing/CRM/loyalty/finance dashboards with contextual cards, filters, and InfoTooltip explanations.
  - Virtual Office UI refresh: clearer department selection, instructions, and links to modules (pricing drafts, campaigns, loyalty lists).
- **Brand Owner / Customer UI**
  - No major deliverable yet; UX improvements remain within admin plane but set the foundation for reuse.

## Phase 4.2 – Platform Ops & Maintenance
- **Backend**
  - Surface system metrics via existing modules (activity logs, automatic errors, automation logs) to support ops dashboards.
  - Persist job/back-up metadata (if necessary) via simple tables or existing logs without altering main schema.
- **Admin Frontend**
  - Add Platform Ops section: Health dashboard, Error Center, Jobs & Backups, Session Security, Audit Logs. Ensure data is filterable and lexically explained with InfoIcons.
  - Tie Notifications + Activity to ops events (severity filtering, direct links).
- **Brand Owner / Customer UI**
  - Keep ops view siloed for admins; optional “platform status strip” (read-only) for brand dashboards.

## Phase 5 – Stand / POS + Sales Rep Engines (Phase 5 Family)
- **Phase 5.1 – Domain Modeling**
  - Add Prisma tables for StandPartners, StandLocations, StandPackages, StandInventory, StandOrders, StandLoyalty/Bonuses, SalesReps, SalesTerritories, SalesAccounts/Leads, SalesVisits, SalesQuotes, SalesOrders, SalesCommissions.
  - Seed HAIROTICMEN stand partner + rep data to illustrate package onboarding and territory planning.
  - Introduce RBAC (ops:stand, stand:*, sales-rep:*) and backend modules to serve CRUD + summaries.
- **Phase 5.2 – Admin UI & Dashboards**
  - Add Stand / POS navigation group (Partners, Locations, Inventory, Loyalty/Bonuses) and Sales Rep workspace (Leads, Territories, Reps, Quotes).
  - Reuse PageHeader + cards/tables; show refill alerts, visit plans, commission tiles, and AI insight buttons.
  - Provide forms for onboarding partners, creating refill orders, and logging rep visits.
+- **Phase 5.3 – AI & Virtual Office Hooks**
  - Extend `core/ai` prompts/orchestrator for Stand insights (refill health, loyalty bonuses), territory insights, and lead follow-up templates.
  - Add AI endpoints (/ai/stand/insights, /ai/sales/territory-insights, /ai/sales/lead-followup).
  - Introduce Virtual Office meeting type “Stand & Sales Review”; route outputs to automations/notifications/actions.

## Phase 5 – Automation Engine & Notifications
- **Backend**
  - Expand automation events/rules ingestion: map outputs (pricing guardrail breach, marketing underperformance) to automation triggers.
  - Harden notification service to accept severity/channel, link to Virtual Office outputs and ops events.
- **Admin Frontend**
  - Automation hub with rule builder, trigger-action pairs, and execution log.
  - Enhanced notifications center (bulk actions, filter by module, severity icons) and connections to Automations/Virtual Office outputs.
- **Brand Owner / Customer UI**
  - Introduce “Automation Inbox” card on brand dashboard showing pending rules, auto-actions, and approvals.
  - Customer portal gets notifications channel (loyalty, orders, support).

## Phase 6 – Brand Owner Dashboard
- **Backend**
  - Enforce brand scoping in APIs (product/pricing/CRM/marketing/loyalty) with RBAC and filtering defaults, reusing existing Prisma relations.
  - Seed brand-specific AI configs (HAIROTICMEN) to deliver targeted insights.
- **Admin Frontend**
  - Split navigation into admin vs brand views; allow brand owner persona to default into commerce/growth/money workspace.
  - Reuse Admin components (tables/cards) but with brand filters, e.g., tie AI HQ to brand-specific insights and KPIs.
- **Brand Owner / Customer UI**
  - Launch brand dashboard: commerce, growth, money, automation, virtual office. Provide day-to-day KPIs and AI suggestions for brand operators.
  - Start concept work on customer-facing portal (HAIROTICMEN home, loyalty wallet, product catalog).

## Phase 7 – Virtual Office v2 & AI Crew Deep Integration
- **Backend**
  - Persist meetings, recommendations, action items (link to automation/event modules) for history and audit.
  - Expand AI orchestrator to ingest more domain data (pricing guardrails, marketing performance, CRM health) when summarizing.
- **Admin Frontend**
  - Virtual Office v2: meeting history, rerun capability, AI agent profiles, and direct routing of outputs into automations/notifications/pricing drafts.
  - Deep integration with AI Crew: each director’s insights surfaced as cards across dashboards, with direct links to modules.
- **Brand Owner / Customer UI**
  - Expose Virtual Office outputs within brand dashboard (widget showing latest meeting, action item statuses).
  - Introduce AI assistant surfaces in customer portal, reflecting AI crew recommendations (product suggestions, routines).

## Constraints / Guardrails
- Avoid schema-breaking changes unless explicitly approved; prefer adding new fields to DTOs or using JSON blobs in existing models.
- Maintain current RBAC, permission seeds (`admin@os.com`, `StrongPassword123`), and guardrail policies; new features must respect existing roles.
- Treat archive/docs as domain knowledge only—do not copy legacy implementations wholesale.
- Keep UI refactors incremental: build atop existing components and only gradually expose high-touch brand owner experiences.
- Do not delete working backend modules. Every new view should respect existing routes (`/dashboard/...`) and data flows.
