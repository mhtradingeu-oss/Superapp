# Phase 5‑8 Domain Design for MH‑OS SUPERAPP

This planning document stays in **Design Only** mode—no code changes are introduced. It synthesizes the existing foundation (notably `docs/01_product-vision.md`, `docs/02_ux-ia-dashboards.md`, `docs/03_ai-crew-and-virtual-office.md`, and `docs/04_execution-roadmap-phase4-7.md`) with the current repo state to propose a safe, multi-brand, AI-first expansion for the next domains.

## 1. Implemented vs Planned Matrix

- **Stand / POS (Phase 5)**  
  - *Implemented*: `back-end/src/modules/stand/` exists with standard controller/service/routes stubs; docs already refer to a Stand Director, refill alerts, and refill boards (`docs/01_product-vision.md`, `docs/02_ux-ia-dashboards.md`, `docs/03_ai-crew-and-virtual-office.md`). No `front-end/app/stand` pages yet.  
  - *Planned*: Full `stand-pos` Prisma schema, partner onboarding, inventory/loyalty flows, refill automation hooks, AI refill insights, and Virtual Office Stand Review.

- **Sales Rep Engine (Phase 5)**  
  - *Implemented*: `back-end/src/modules/sales-reps/` scaffolding plus references in UX docs (territories, quotes, commissions). No frontend surfaces yet.  
  - *Planned*: Territory/lead/visit/quote/order models, AI lead-followup hooks, commission tracking, CRM convergence, Virtual Office Sales Reviews, and automation triggers.

- **White Label Studio (Phase 6)**  
  - *Implemented*: Module scaffolding at `back-end/src/modules/white-label/`; high-level OS description in `docs/03_os_index.md` and roadmap mention. No UI or data models beyond placeholders.  
  - *Planned*: Brand product configurator, packaging/asset manager, pricing templates, marketing plan builder, AI Brand Builder orchestration, integration with Products/Pricing/CRM/Marketing modules.

- **IVR / Contact Center (Phase 7)**  
  - *Implemented*: No backend modules, models, or frontend routes yet; only referenced in roadmap `docs/04_execution-roadmap-phase4-7.md`.  
  - *Planned*: Call session/intent/recording models, IVR flows, CRM linking, AI summarization and tagging, support ticket integration, activity log entries.

- **Self-Optimization Agents (Phase 8)**  
  - *Implemented*: AI Brain/Orchestrator infrastructure exists, but no agent-specific workflows for SEO, UX, Ops.  
  - *Planned*: Agent data readers (SEO performance, UX funnel events, Ops metrics), suggestion tables, automation or report destinations, safety guardrails.

## 2. POS / Stand + Sales Rep Architecture

### 2.1 Prisma Model Blueprint (additive + brand-safe)
- `StandPartner`
  - `id`, `brandId` (nullable for shared stand programs), `partnerId` reference to `Partner`, `name`, `standType`, `status`, `onboardingStatus`, `paymentMetadataJson`, `createdAt`, `updatedAt`.
- `StandLocation`
  - `id`, `standPartnerId`, `geoLocationJson`, `address`, `region`, `status`, `qrCodeUrl`, `createdAt`, `updatedAt`.
- `StandPackage`
  - `id`, `brandId`, `name`, `description`, `inventoryThresholdsJson`, `pricingJson`, `allowedProductsJson`, `createdAt`, `updatedAt`.
- `StandInventory` + `StandInventorySnapshot`
  - `standLocationId`, `productId → BrandProduct`, `quantity`, `status`, `lastRefillAt`, snapshots keep `dataJson` per heartbeat.
- `StandRefillOrder` + `StandRefillItem`
  - `status` (PLANNED, SENT, RECEIVED), `expectedAt`, `carrierInfoJson`, items reference products, qty, cost, refill source (auto/manual).
- `StandLoyaltyLedger`
  - Tracks partner loyalty points, tier (`tierId?`), bonus events, `balance`, `lastAdjustedAt`.
- `StandBonusTrigger`
  - `standPartnerId`, `eventType` (REFILL, SALES_spike), `bonusAmount`, `approvedBy`, `status`, to tie into automation/finance payouts.
- `SalesRep`, `SalesTerritory`, `SalesRepTerritoryAssignment`, `SalesLead`, `SalesVisit`, `SalesQuote`, `SalesQuoteItem`, `SalesOrder`, `SalesOrderItem`, `SalesCommission`, `SalesRoutePlan`, `SalesRouteStop`, `SalesPerformanceSnapshot`, `SalesPipelineActivity`.
  - All with `brandId`, `territoryId`, `userId` references for RBAC, `createdAt`, `updatedAt`.
  - `SalesLead` links to `Person`/`Company` (CRM) and carries `source`, `score`, `stage`.
- `SalesCommission` stores `rate`, `period`, `earned`, `paidAt`, `status` to tie into Finance payouts and notifications.

### 2.2 Backend Modules & Routes
- **`stand-pos` module** (new folder under `modules/stand-pos/` to keep clear boundaries). Routes:
  - `GET /api/v1/stand-pos/partners`
  - `POST /api/v1/stand-pos/partners`
  - `GET /api/v1/stand-pos/partners/:id`
  - `POST /api/v1/stand-pos/partners/:id/locations`
  - `GET /api/v1/stand-pos/locations/:id/inventory`
  - `POST /api/v1/stand-pos/refill-orders`
  - `POST /api/v1/stand-pos/refill-orders/:id/confirm`
  - `GET /api/v1/stand-pos/loyalty-balances`
  - `POST /api/v1/stand-pos/loyalty-balances/:id/bonus`
  - `GET /api/v1/stand-pos/alerts` (low-stock, late refill, loyalty bump)
  - `GET /api/v1/stand-pos/ai/insights` (proxy to AI Brain)
- **`sales-reps` module extension** (keep existing folder, add new routes):
  - `GET /api/v1/sales-reps/territories`
  - `POST /api/v1/sales-reps/territories`
  - `POST /api/v1/sales-reps/territories/:id/assign`
  - `GET /api/v1/sales-reps/leads`
  - `POST /api/v1/sales-reps/leads`
  - `POST /api/v1/sales-reps/visits`
  - `POST /api/v1/sales-reps/quotes`
  - `POST /api/v1/sales-reps/orders`
  - `GET /api/v1/sales-reps/commissions`
  - `GET /api/v1/sales-reps/pipeline-activity`
  - `GET /api/v1/sales-reps/ai/territory-insights`
Route handlers stay in controllers/services/validators pattern; AI-specific helpers live in `sales-reps.ai.ts`.

### 2.3 Key Flows
- **Stand lifecycle**  
  1. Partner signs contract (StandPartner) → location(s) registered with inventory thresholds.  
  2. Packages are onboarded (StandPackage) and assigned to locations; inventory tracked via StandInventory + snapshots.  
  3. Refill alerts trigger when quantity drops below `inventoryThresholds`; automation event seeds `StandRefillOrder` draft.  
  4. Refill order approved (manual or automation) → logistics updates → partner receives shipment; inventory increments and loyalty points recorded.  
  5. Performance metrics (sales vs forecast, refill cadence, bonus status) surface in dashboards and as `StandBonusTrigger` events for Payout/Finance.

- **Sales rep lifecycle**  
  1. Territory definition (SalesTerritory) → assign reps (SalesRepTerritoryAssignment).  
  2. Leads (linked to CRM Persons/Companies) captured from field, automated scoring via AI Brain (AI lead follow-up).  
  3. Visits plan + log (SalesVisit, SalesVisitNote) → attach follow-up tasks to CRM/Activity log.  
  4. Quotes drafted (SalesQuote + items) referencing Pricing/Product SKUs → convert to orders with guardrails; Virtual Office can review pipeline.  
  5. Orders generate commissions; `SalesCommission` records sync with Finance payouts + notifications; performance snapshots feed leaderboards and AI insights.

### 2.4 AI + Virtual Office Interactions
- **AI monitoring**  
  - Stand Director agent polls `StandInventorySnapshot`, `StandRefillOrder`, `StandBonusTrigger` → produces refill urgency insights (`severity`, `recommended shipment`, `automation seed`).  
  - Sales Director agent reads `SalesPipelineActivity`, `SalesLead`, `SalesVisit`, `SalesOrder` → surfaces territory gaps, risky deals, commission drift.  
  - Both agents push insights through AI Brain (via `stand-pos.ai.ts`, `sales-reps.ai.ts`) into `AIInsight`, `AIReport`, and `Activity log`.
- **Virtual Office**  
  - New meeting type “Stand & Sales Review” includes Stand Director, Sales Director, Finance Director, Ops Director.  
  - Inputs: latest refill alerts, loyalty bonus triggers, territory performance snapshots, visit notes, outstanding quotes.  
  - Outputs: action items (create refill order, contact partner, escalate quote), routed to Automations, Notifications, Activity log, Pricing drafts, CRM tasks.  
  - Action items also rehydrate `StandRefillOrder` and `SalesFollowUp` drafts so the Virtual Office becomes the orchestration layer for field commerce.

## 3. White Label Studio Architecture

### 3.1 Prisma Models & Relationships
- `WhiteLabelBrand` (`ownerPartnerId`, `brandName`, `status`, `settingsJson`, `createdAt`, `updatedAt`).  
- `WhiteLabelTemplate` (`wlBrandId`, `name`, `category`, `targetAudienceJson`, `aiInstructionSet`, `createdAt`, `updatedAt`).  
- `WhiteLabelProductBlueprint` (`wlBrandId`, `baseProductId → BrandProduct?`, `sku`, `ingredientsJson`, `packagingStyleJson`, `pricingRulesJson`, `aiDraftsJson`).  
- `WhiteLabelAsset` (`wlBrandId`, `type` (logo, packaging, media), `url`, `metadataJson`).  
- `WhiteLabelLaunchPlan` (`wlBrandId`, `phase`, `dependenciesJson`, `status`, `marketingPlanJson`, `pricingPlanJson`).  
- `WhiteLabelCampaign` references `campaignId` from Marketing OS as part of launch.  
- `WhiteLabelPricingLock` to capture approved pricing per channel referencing `ProductPricing`.  
- `WhiteLabelCRMAccount` to link WL brand to CRM leads/accounts for ongoing demand.  
- Multi-brand safety: each WL entity has `brandId` (if the white-label line is tied to a live brand) and `ownerPartnerId` for partner-level quotas.

### 3.2 Backend Workflows
- **Idea → Templates**:  
  - `POST /api/v1/white-label/ideas` persists idea metadata, links to `BrandAIConfig`.  
  - AI Brain (Brand Director, White Label AI) populates `WhiteLabelTemplate` suggestions via `white-label.ai.ts`.  
  - Templates feed `WhiteLabelProductBlueprint` (ingredient/packaging specs, competitor context from Pricing + Marketing).
- **Packaging/Assets**:  
  - Endpoint `POST /api/v1/white-label/assets` uploads packaging/visual assets; metadata stored for reuse.  
- **Pricing**:  
  - `POST /api/v1/white-label/pricing/plans` references `ProductPricing`, `Stand`/`Dealer` price lists, and `white-labelPricingRules`.  
  - Pricing Director agent validates guardrails, writes to `WhiteLabelPricingLock`.
- **Marketing Plan → Launch**:  
  - `POST /api/v1/white-label/launch-plans` composes channel mix using Marketing OS campaigns, CRM segments, and AI content briefs.  
  - Launch plan creates `AutomationEvent` seeds for notifications, inventory, and stand/sales integrations.

### 3.3 Brand Owner UI
- **Wizard steps** (reuse admin components + AI Dock):
  1. Idea capture (text, persona, goal; InfoTooltip cites `BrandAIConfig`).  
  2. Formula/template selection (list of `WhiteLabelTemplate`, AI scoring).  
  3. Packaging & assets (assets gallery + upload).  
  4. Pricing (margin guardrails, channel-specific nets, automation for promotions).  
  5. Marketing & CRM activation (campaign builder referencing Marketing + CRM data).  
  6. Launch readiness (status tracker, automation seeds, Virtual Office prep).
- **Dashboards**:  
  - `White Label Launch Overview` card (progress, risk, AI summary).  
  - `Brand Owner Console` shows KPI tiles (time-to-launch, cost burn, expected revenue, automation readiness).  
  - `Asset Library` + `Campaign Preview` sections reuse Card/Table/Tabs components.
- **AI Wizards**:  
  - `AI Brand Builder` with prompts tied to `ai-brain` (storyboard, tone, compliance).  
  - `AI Packaging Critic` ensures packaging/text respects `BrandRules`.  
  - `AI Launch Coach` suggests next steps and populates Virtual Office agenda.

### 3.4 Reuse Strategy
- **Products**: base ingredient/pricing references from `BrandProduct`, `ProductPricing`, enabling `WhiteLabelProductBlueprint` to extend existing SKUs.  
- **Pricing**: guardrails from Pricing OS and `ProductPriceDraft` leveraged for approval workflow in WL.  
- **AI Brain**: orchestrates white-label-specific agents, reuses `aiInsights` for recommendations.  
- **CRM**: contacts/leads reused for pre-launch audience segments, sales enabling, and linking `WhiteLabelCRMAccount`.  
- **Marketing**: Marketing campaigns/copies serve White Label marketing plan; `ContentPlan` reused for channel scheduling.

## 4. IVR / Contact Center + Agents

### 4.1 Models & Endpoints
- `CallSession`: `id`, `brandId`, `standLocationId?`, `leadId?`, `userId?`, `startedAt`, `endedAt`, `status`, `ivrFlowId`, `recordingUrl`, `aiSummaryId`, `createdAt`, `updatedAt`.  
- `CallIntent`: `name`, `confidence`, `sessionId`, `intentMetaJson`.  
- `CallOutcome`: references `CallSession`, `resultType` (SALE, ISSUE, INFO), `notes`, `nextAction`.  
- `CallRecording`: metadata, transcription reference, `storageUrl`.  
- `IVRFlow` + `IVRStep`: definitions for IVR menus, options, and default routing.  
- `IVRCallTag`: tags for downstream automation (`support`, `order`, `loyalty`).  
- `IVRNextAction`: pointer to CRM task/ticket creation, automation triggers.

Endpoints:
  - `GET /api/v1/ivr/call-sessions`
  - `POST /api/v1/ivr/call-sessions`
  - `POST /api/v1/ivr/call-sessions/:id/intents`
  - `POST /api/v1/ivr/call-sessions/:id/outcomes`
  - `GET /api/v1/ivr/flows`
  - `POST /api/v1/ivr/flows`
  - `POST /api/v1/ivr/ai/summaries`
  - `POST /api/v1/ivr/recordings`
  - `GET /api/v1/ivr/tags`

### 4.2 Attachments
- CRM leads/contacts (`Lead`, `Person`, `Company`) referenced via `leadId`/`contactId`; call sessions log follow-ups in CRM task tables.  
- Support tickets (`Ticket` model) created/updated from `CallOutcome`/`IVRNextAction` with links captured in `activity-log`.  
- Activity log receives entries for each call session, summary, and automation trigger to maintain audit trails.

### 4.3 AI Usage
- `ai-brain` agents (Support Director, Sales Director, CRM Director) generate:
  - **Summaries**: conversation gist stored in `AIInsight` with `callSessionId`.  
  - **Tagging**: assign intent/outcome tags (complaint, upsell, technical) so Marketing/Support can act.  
  - **Next actions**: queue tasks (CRM follow-up, automation of ticket, revisit loyalty) routed via `AutomationRule`.  
- Real-time prompts happen via `ai-brain` orchestrator (no provider bypass) so `IVR` module feeds text/metadata to the AI layer before storing output.

## 5. Self-Optimization Agents

### 5.1 SEO Agent
- **Reads**: `MarketingPerformanceLog`, `CompetitorPrice`, `SocialMention`, `BrandIdentity.keywords`, `KnowledgeDocument` tags.  
- **Writes**: `OptimizationSuggestion` entries (new table: `id`, `agentType=SEO`, `brandId`, `sourceDataJson`, `suggestionJson`, `status`, `assignedTo`, `createdAt`).  
- **Outputs**: suggestions for metadata, copy, campaign targeting; seeds `AutomationEvent` for marketing updates or notifications.

### 5.2 UX / Funnel Agent
- **Reads**: `activity-log` events, front-end telemetry (page hits, CTA conversions), `CRM` funnel stage transitions.  
- **Defines Problems**: `FunnelIssue` table references `route`, `stage`, `dropOffRate`, `sessionSampleJson`.  
- **Writes**: `OptimizationSuggestion` entries (agentType=UX) and `AutomationEvent` seeds (A/B tests, new onboarding flows) stored in `aiInsights`.  
- **Feedback Loop**: monitors `MarketingPerformanceLog` and CRM stage changes to mark a suggestion `resolved`.

### 5.3 Ops / Schema Agent
- **Reads**: `operations` metrics (`error` counts, `platform-ops` heartbeats), DB metadata (table row counts, migration history), `activity-log` around schema changes.  
- **Outputs**: `OptimizationSuggestion` entries (agentType=OPS) containing risk level, cost, and mitigation steps; also writes to `AutomationEvent` (e.g., scale worker, alert engineering).  
- **Visibility**: suggestions surfaced in Platform Ops + Virtual Office, with `AIInsights` referencing `tableStats` and `recentErrors`.

## 6. Updated Roadmap

### Phase 5 – Commerce Field Engine

#### 5.A – Design (Docs + Models)
- Deliverables: final Prisma models (`stand-pos`, `sales-reps`), event/automation contracts, UX wireframes, AI prompts.  
- Risks: data scope creep (inventory vs loyalty), missing RL scheduling for reps.  
- Constraints: add-only schema, reuse `BrandProduct`/`ProductPricing`, respect RBAC seeds.  
- Impact: prepares `stand-pos`, `sales-reps`, `ai-brain`, `automation` modules for iterative builds.

#### 5.B – Backend Implementation
- Deliverables: `stand-pos` and `sales-reps` modules with controllers/services/routes, Prisma migrations, automation entry points, AI endpoints.  
- Risks: multi-brand data leakage, AI guardrail alignment, commission/payout consistency.  
- Constraints: maintain existing APIs for other modules; no provider bypass (AI always through `ai-brain`).  
- Impact: extends `inventory`, `finance`, `crm`, `notification`, `platform-ops` for stand/sales data.

#### 5.C – Frontend (Admin + Brand Dashboards)
- Deliverables: stand partner/inventory/loyalty views, sales/territory/pipeline dashboards, AI insight cards, Virtual Office card for Stand & Sales Review.  
- Risks: overloaded UI (need reuse of existing cards/InfoTooltips), data load/performance.  
- Constraints: keep components (PageHeader, Cards, etc.) consistent; respect brand scoping.  
- Impact: updates brand and admin navigation trees (per `docs/06_frontend_pages_navigation.md`), adds `/stand` and `/sales` routes.

#### 5.D – AI + Virtual Office Integration
- Deliverables: Stand Director + Sales Director prompts, new Virtual Office meeting type (Stand & Sales Review), automation seeds, notifications, activity log hookup.  
- Risks: inaccurate AI summaries tipping into guardrail breaches; event storming when automations fire.  
- Constraints: orchestrator must pass through `ai-brain`; action items fire through existing automation/notification modules.  
- Impact: affects `ai-brain`, `virtual-office`, `automation`, `activity-log`, `notification`.

### Phase 6 – Brand Owner Dashboard + White Label Studio
- Deliverables: Brand-scoped workspace, White Label Studio wizard, AI Brand Builder/Launch Coach, marketing/CRM integration for WL launches.  
- Risks: ensuring brand scoping does not leak multi-tenant data; heavy reuse of Marketing/CRM data may need caching.  
- Constraints: reuse existing modules (Products, Pricing, Marketing, CRM, AI) with guardrails; no rewriting of admin-only modules.  
- Impact: touches `white-label`, `brand`, `pricing`, `marketing`, `crm`, `ai-brain`, `frontend app navigation`.

### Phase 7 – IVR / Contact Center
- Deliverables: IVR + call session models, CRM/support linkages, AI summarization/tagging, UI views for call logs and tickets.  
- Risks: compliance with recordings, storage of PII, guaranteeing real-time experience.  
- Constraints: must fit existing RBAC/permission system; storage of recordings needs secure metadata referencing (no direct file blobs).  
- Impact: extends `support`, `crm`, `notification`, `activity-log`, `ai-brain`, new `ivr` module + frontend route(s).

### Phase 8 – Self-Optimization Agents
- Deliverables: SEO/UX/Ops agents that read telemetry/logs, write `OptimizationSuggestion` entries, surface in Virtual Office/Platform Ops.  
- Risks: agent noise (false positives), data freshness (metrics lag).  
- Constraints: rely on existing telemetry tables/logs, guardrails defined in `BrandRules`/`ai-config`.  
- Impact: touches `ai-brain`, `platform-ops`, `activity-log`, `automation`, `marketing`, `operations`.
