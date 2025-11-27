# UX & IA Blueprint for MH-OS Dashboards

## A) Platform Admin Dashboard
- **Sections**
  - **Command Center**: Landing page with KPIs (revenue, pricing deltas, CRM conversions, loyalty uplift) and shortcuts (users, brands, products, pricing, notifications, automations).
  - **User & Role Management**: Directory of users, RBAC role definitions, permission guards, platform policies, AI restriction policies, and SUPER_ADMIN seeding.
  - **Brands & Tenants**: Brand catalog (including HAIROTICMEN), brand metadata, AI configs, automation templates, loyalty programs, partners, and white-label views.
  - **AI HQ / Insights**: KPI summary cards, revenue/pricing/inventory charts, latest insights and reports, AI assistant entry point.
  - **Notifications & Activity**: Filterable inbox for alerts (type/status), bulk actions, activity timeline grouped by date/module, links to trace events.
  - **Automations & Rules**: Library of rules, trigger-event/condition grid, execution log, linked notifications.

- **What the admin sees**
  - Health indicators (API latency, queue status, worker heartbeat).
  - Error center counts and severities.
  - Backups/jobs status snapshots.
  - Security posture (active sessions, suspicious logins, RBAC changes).
  - AI metrics (request volume, errors, guardrail breaches, pricing AI confidence).

- **Smart ops tools**
  - **Error monitoring**: Table showing error title, module, severity, stack snapshot/trace link, status badge, and “Re-run test” action.
  - **Performance dashboards**: Cards with response times (p50/p95), throughput per service, and resource utilization chart linked to InfoTooltip (“metric pulls from telemetry service”).
  - **Backups**: Job list with frequency, last run, success status, retention, and “Re-run” CTA.
  - **User/brand management**: Table with filters (role, status, brand), inline RBAC info, quick invite, and Data export.
  - **AI guardrail monitoring**: Cards showing AI request count, failure rate, guardrail violation count, and InfoTooltip for each metric (“Guardrails defined in ai-brain config”).
  - **Info icons** appear next to KPIs/tables explaining metric source (e.g., “Revenue from finance module via `financialKPIRecords`”), safe actions, and AI trust level.

## B) Brand Owner Dashboard
- **Navigation differences**
  - Focus on brand-scoped workspaces: Commerce, Growth, Money, Automation & Tasks, Virtual Office.
  - Access only their brand’s data (HAIROTICMEN initially); includes quick switcher.
  - Admin-level modules (RBAC, platform health) hidden or available via “Platform view” toggle when needed.

- **Key sections & screens**
  - **Commerce**: Product catalog w/ variant cards, pricing editor (costs, margin, AI suggestions, competitor collage), inventory health, reorder suggestions.
  - **Growth**: CRM leads list + funnel chart, marketing campaigns w/ channel/budget/status, loyalty customers/tiers/rewards, AI insights section.
  - **Money**: Finance overview cards (revenue, margins, cashflow, upcoming payouts), revenue table grouped by product/channel, trend charts.
- **Automation & Tasks**: Rules list, run history, queue, linked notifications, automation builder UI.
- **Virtual Office**: Meeting launcher, agenda builder, department selection, and AI outputs.
- **Stand / POS Partner OS**: Partner directory with packages, refill alerts, inventory, and loyalty/bonus cards that tie into QR/payment metadata.
- **Sales Rep Engine**: Lead/territory board, visit planning, pipeline cards, commission tracker, and quotes/orders tied to pricing.

- **Daily KPIs & cards**
  - Revenue vs target, pricing delta %, inventory risk count, CRM conversion rate, loyalty uplift %, automation health.
  - Each card includes InfoTooltip describing data source and update cadence.

- **Important screens**
  - Pricing detail (with guardrails, AI review, approvals, history timeline).
  - Campaign overview (channel, objective, spend, ROAS, status, AI-generated copy ideas).
  - Loyalty program dashboard (tiers, points earned/burned, retention flags).
  - Finance insight panel (gross margin by product, cash runway, outstanding invoices).
  - Stand partner profile (package, refill queue, inventory + location map, loyalty status, settlement velocity).
  - Stand refill board (low-stock rows, reorder CTA, automation hint to create draft order).
  - Sales rep dashboard (territory KPIs, pipeline by stage, visit log, commission vs target, quote snapshot).
  - Leads & accounts table (score, owner, status, next action, AI follow-up).

## C) Customer Portal (Concept for HAIROTICMEN)
- **User experience**
  - Branded landing page (hero story, key product categories).
  - **Home**: Dynamic hero (AI narrative), trending SKUs, loyalty tier status card.
  - **Products**: Filterable catalog, pricing transparency, “AI skin/hair advisor” snippets, competitor trust badges.
  - **Loyalty Wallet**: Points balance, tier progress bar, expiring rewards, ability to redeem/refill.
  - **Orders**: Timeline of recent purchases, status badges, return links.
  - **Support**: Ticket creation, chat transcripts, FAQ curated per brand.
  - **AI Assistant**: Conversational card recommending routines/products; integrates prompts (e.g., “Best routine for textured hair”).

- **Pages/components**
  - Cards for featured SKUs, banners for flash sales, grid for loyalty perks.
  - Table for orders with filters (status, date).
  - CTA buttons with InfoTooltip for loyalty points (“Points earned through purchases + referrals”).
  - Support widget showing SLAs and predicted wait times.

## D) Virtual Office
- **Interface**
  - Meeting setup form (brand selector, scope dropdown (launch, pricing, CRM…), topic input, agenda textarea, notes).
  - Department tiles showing AI agent charter, focus, and “In meeting” badges.
  - Output panes: Summary box, Agenda item cards, Risks list, Recommendations grid (per department), Action Items list.
  - Buttons to route recommendations to Automations, Notifications, Pricing drafts, and CRM tasks.

- **Meeting types**
  - Pricing Review (products, guardrails, competitor shifts).
  - Growth Strategy (campaign performance, CRM pipeline, loyalty activations).
  - Monthly Business Review (finance health, inventory/partner alignment).
  - Launch Readiness (product, marketing, inventory, compliance).
- **Stand & Sales Review**: New meeting that pulls refill alerts, partner onboarding status, territory pipeline, and commission health to prepare automations/notifications.

- **Info icon guidance**
  - Agenda info (“Each line becomes a focus area; use bullet per desired output”).
  - Department info (“AI charters seeded via `aiAgentConfigs`”).
  - Output info (“Action items auto-log to Activity; link to automation builder for direct execution”).

## E) Platform Ops & Maintenance
- **Pages/cards**
  - **Health Dashboard**: API status, DB replication, queue depth, worker heartbeat cards.
  - **Error Center**: Table of recent errors (module, severity, stack, first/last seen, status).
  - **Jobs & Backups**: Cron job tables, last run, runtime, failure rate, telemetry charts.
  - **Security & Sessions**: Active sessions list, location/IP, device, last activity, revoke action.
  - **Audit Logs**: RBAC changes, AI actions, automation events, pricing updates; filters by module/actor.

- **Relationship to Notifications & Activity**
  - Critical ops issues trigger notifications (type=platform.health/error) automatically.
  - Activity log stores all ops actions with metadata; each ops card links to activity detail via icon.

- **Filters & tables**
  - Multi-column tables with search/filter by severity, module, time frame.
  - Info icons explaining severity colors, expected baselines, and remediation steps.
