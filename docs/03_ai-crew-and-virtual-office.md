# AI Crew & Virtual Office Playbook

## AI Department Heads (Smart Directors)
Each director is instantiated as an AI agent with a charter, default focus, and permissions.

| Director | Charter | Default Focus | Touchpoints |
| --- | --- | --- | --- |
| Pricing Director | Maintain margin health, price positioning, channel ladders | Guardrails, competitor tracking, price drafts | Pricing editor, Virtual Office, Automations |
| Growth / Marketing Director | Demand generation, campaign orchestration, ROI | Channel mix, creative briefs, budgets | Marketing campaigns, AI HQ, Virtual Office |
| CRM Director | Lead health, segmentation, routing, follow-ups | Scoring, follow-up cadence, pipeline velocity | CRM leads, Activity log, Virtual Office |
| Loyalty Director | Retention, rewards, VIP motion | Tier balances, points burn/earn, expirations | Loyalty dashboard, Notifications, Virtual Office |
| Finance Director | Margin discipline, cash runway, forecast | Revenue vs cost, payouts, invoices | Finance overview, Virtual Office, AI reports |
| Operations / Inventory Director | Stock reliability, restock cadence | Inventory risk, reorder suggestions, logistics | Inventory module, Virtual Office, Automations |
| Brand Director | Narrative consistency and positioning | Messaging, launch stories, enablement | Virtual Office summary, AI reports |
| Stand Director | Partner onboarding, refill cadence, settlements | Stand inventory, packages, loyalty/bonuses | Stand POS dashboard, Virtual Office, Automations |
| Sales Director | Territory performance, rep enablement, pipeline | Leads, visits, quotes, commissions | Sales rep engine, Virtual Office, Activity log |

Each director feeds prompts/templates in `core/ai/orchestrator.ts` and ties back to `aiAgentConfigs`, `aiInsights`, `aiReports`, and `aiLearningJournals`.

## Virtual Office as the AI Meeting Room
- **Purpose**: Align the founders/owners with the AI crew via scoped meetings. Example: “Pricing review for HAIROTICMEN launch in Germany.”
- **Inputs**
  - Brand context (brandId, slug, AI config, guardrails).
  - Topic, scope selector (pricing, marketing, crm, inventory, loyalty, launch, growth).
  - List of departments participating; default includes marketing, sales, finance but customizable.
  - Agenda (newline-separated outcomes).
  - Notes (constraints, KPIs, blockers).
  - Optional brand signals (pricing drafts, campaign statuses, CRM queue metrics).

- **Meeting Flow**
  1. Owner selects brand + scope + departments.
  2. Agenda & notes populate.
  3. Virtual Office runs orchestrator (`runVirtualOfficeMeeting`).
  4. AI crew returns summary, agenda outputs, risks, recommendations, and action items.

- **Outputs**
  - **Summary card**: concise briefing with severity/peril badge.
  - **Agenda items**: each includes desired outcome, pacing.
  - **Risks list**: flagged execution issues.
  - **Recommendations**: per department, with owner (AI or human), impact, and attachments (pricing drafts, campaigns).
- **Action items**: tasks routed to automations or human owners; includes due date, department, impact, links to modules.

- **Stand & Sales Review**: new meeting type that adds Stand + Sales + Finance Directors, collects partner/inventory/territory signals, and emits action items like refill approvals or rep follow-ups ready for Automations/Notifications.

### Integrations for Outputs
1. **Automations**  
   Recommendations create automation seeds (e.g., “When competitor price drops 5% → create pricing draft and notify Pricing Director”). Action item cards have “create automation” CTA.
2. **Notifications**  
   Risque action or recommendation failure generates notifications (type=ai, module=virtual-office). Notification center shows status badges (unread/read) for Virtual Office outputs.
3. **Activity Log**  
   Every meeting run (payload + outputs) is logged via `activity-log` module. Cards link to Activity timeline entry; filter by `module=virtual-office`.
4. **Pricing / Marketing / CRM Modules**  
   - Pricing: AI recommendations link to pricing drafts/competitor inputs, guardrail reminders appear inline. Action items can pre-fill `ProductPriceDraft`.
   - Marketing: Recommendations create campaign briefs; AI creative ideas stored as `contentPlans` or `campaigns`.
   - CRM: Follow-up tasks translate to lead assignments; action items include CRM tasks with due dates.

## AI Crew Governance
- **Inputs** such as guardrails, AI restrictions, brand identity all stored in Prisma models (`BrandAIConfig`, `BrandRules`, `BrandIdentity`).
- **Outputs** stored in `AIInsight`, `AIReport`, `AILearningJournal`, and `AIPricingHistory` for traceability.
- **Permissions** enforced via `PermissionGuard` (e.g., `ai:pricing`, `ai:virtual-office`).
- **Info icons** on Virtual Office cards remind users where data came from (“Agenda items originate from the virtual-office agenda textarea; recommendations honor `BrandRules.pricingConstraints`”).
