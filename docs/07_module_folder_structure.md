📘 07_module_folder_structure.md
MH-OS SUPERAPP — Module Folder Structure (Back-end + Front-end)

هذا المستند يعرّف بنية المجلدات والمعايير التي يجب أن يلتزم بها كل كود في المشروع (Back-end + Front-end)، بحيث:

كل OS (Sales, CRM, Pricing, Loyalty, …) يكون Module واضح.

سهل التوسعة بدون كسر أي شيء.

سهل على أي مطور جديد يفهمه.

متوافق 100% مع الـ Master Prompt و Codex.

🏗 1. هيكل المستودع الرئيسي (Monorepo Style)

في جذر المشروع (GitHub repo: mh-os-superapp):

mh-os-superapp/
  back-end/
  front-end/
  docs/
  archive/
  .gitignore
  README.md
  package.json (اختياري، لو استعملنا pnpm workspace)


back-end/ → API + Business Logic + Prisma + Automation + AI Integration.

front-end/ → Next.js Dashboard + Portals + Virtual HQ.

docs/ → كل مستندات الـ Master Blueprint.

archive/ → الكود القديم / التجارب، بدون استعمال مباشر في النظام الجديد.

🧱 2. Back-end Folder Structure (Node + TS + Express + Prisma)
2.1 الهيكل الأعلى
back-end/
  src/
    core/
    modules/
    app.ts
    server.ts

  prisma/
    schema.prisma
    migrations/

  package.json
  tsconfig.json
  .env
  .env.example

2.2 مجلد core/ — قلب النظام
back-end/src/core/
  config/
    env.ts          # تحميل وضبط المتغيرات (PORT, DATABASE_URL…)
    logger.ts       # إعداد Logger موحّد
    security.ts     # إعداد CORS, Helmet, Rate limiting…

  prisma/
    client.ts       # تهيئة PrismaClient ومشاركته بين الموديولات

  http/
    errors.ts       # تعريف أخطاء مخصصة
    responses.ts    # شكل موحد للـ API responses
    middleware/
      auth.ts       # JWT, Role Guards
      error-handler.ts
      request-logger.ts
      validate.ts   # Validation (zod أو مشابه)

  security/
    password.ts     # Hash/Compare
    jwt.ts          # Sign/Verify JWT
    rbac.ts         # وظائف role / permission

  utils/
    date.ts
    strings.ts
    ids.ts
    pagination.ts
    money.ts
    telemetry.ts

  events/
    event-bus.ts       # EventEmitter بسيط
    events.types.ts    # Types للأحداث العامة (OrderCreated, PriceUpdated…)
    event-handlers.ts  # Handlers مشتركة

  ai-service/
    ai-client.ts    # عميل للتعامل مع مزود LLM (OpenAI أو غيره)
    ai-types.ts     # Types للـ prompts / responses
    ai-config.ts    # إعدادات الـ AI لكل Agent (من BrandAIConfig)


مبدأ أساسي:

لا يوجد منطق Business داخل core/
فقط: بنية مشتركة، إعدادات، أدوات مساعدة.

2.3 مجلد modules/ — كل OS كوحدة مستقلة

كل OS = Module داخل src/modules/:

back-end/src/modules/
  auth/
  users/
  brand/
  product/
  pricing/
  crm/
  marketing/
  sales-reps/
  dealers/
  partners/
  stand/
  affiliate/
  loyalty/
  inventory/
  finance/
  white-label/
  automation/
  communication/
  knowledge-base/
  security-governance/
  admin/
  ai-brain/
  social-intelligence/
  operations/
  support/

2.3.1 قاعدة ذهبية لكل Module

داخل كل module:

src/modules/{module}/
  {module}.controller.ts
  {module}.service.ts
  {module}.routes.ts
  {module}.types.ts         # DTOs / Types
  {module}.validators.ts    # zod schemas (لو نستخدمها)
  {module}.mapper.ts        # تحويل DB models → API response
  {module}.ai.ts            # وظائف AI مرتبطة بهذا الـ Module (لو موجودة)
  index.ts                  # export لوظائف و config الموديول

مثال — Pricing Module
src/modules/pricing/
  pricing.controller.ts
  pricing.service.ts
  pricing.routes.ts
  pricing.types.ts
  pricing.validators.ts
  pricing.mapper.ts
  pricing.ai.ts


controller → يستقبل HTTP Request، يستدعي service، يرجع response.

service → منطق الـ Business، استعلامات Prisma، قواعد الأسعار.

routes → تعريف مسارات Express (/api/v1/pricing/...).

types → تعريف DTO / Types للـ requests & responses.

validators → فحص الـ input (zod أو yup أو يدوي).

mapper → توحيد شكل الاستجابة (مثلاً إخفاء حقول حساسة).

ai → Integrations مع AI Brain / ai-service (تحليل أسعار، نصائح…).

2.4 app.ts و server.ts
app.ts
// back-end/src/app.ts
import express from "express";
import cors from "cors";
import { loadEnv } from "./core/config/env";
import { registerRoutes } from "./modules"; // ملف يجمع routes كل الموديولات
import { errorHandler } from "./core/http/middleware/error-handler";
import { requestLogger } from "./core/http/middleware/request-logger";

export function createApp() {
  loadEnv();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  // Healthcheck
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Register all module routes
  registerRoutes(app);

  // Error handler آخر شيء
  app.use(errorHandler);

  return app;
}

server.ts
// back-end/src/server.ts
import { createApp } from "./app";
import { env } from "./core/config/env";

const app = createApp();
const port = env.PORT || 4000;

app.listen(port, () => {
  console.log(`🚀 API running on http://localhost:${port}`);
});

2.5 Prisma Folder
back-end/prisma/
  schema.prisma
  migrations/
  seed.ts (لو عملنا seeding مشترك)


القاعدة:

كل Model تم وصفه في Master Prompt يجب أن يظهر هنا.

IDs: String @id @default(cuid())

لكل جدول: createdAt + updatedAt

العلاقات واضحة ومكتوبة أسماءها بوضوح.

🎨 3. Front-end Folder Structure (Next.js + App Router)
3.1 Root Structure
front-end/
  app/
  components/
  lib/
  services/
  hooks/
  styles/
  public/
  package.json
  tsconfig.json
  next.config.mjs
  tailwind.config.mjs

3.2 app/ — Next.js App Router

Example:

front-end/app/
  layout.tsx
  page.tsx          # Landing / redirect to /dashboard

  (auth)/
    login/
      page.tsx
    forgot-password/
      page.tsx

  dashboard/
    layout.tsx
    page.tsx

  products/
    page.tsx
    [id]/
      page.tsx

  pricing/
    page.tsx
    matrix/
      page.tsx
    ai-advice/
      page.tsx

  crm/
    page.tsx
    contacts/
      page.tsx
    leads/
      page.tsx

  ... باقي الـ OS (حسب ملف 06)

مبدأ:

كل OS = Route رئيسية في app/.

تحت كل OS موديول، ننشئ sub-routes:

/products, /products/[id]

/pricing, /pricing/matrix, /pricing/ai-advice

/crm, /crm/leads, /crm/pipeline

3.3 components/ — مكتبة المكونات المشتركة
components/
  layout/
    Sidebar.tsx
    Topbar.tsx
    AppShell.tsx
    BrandSwitcher.tsx
    OSNavigator.tsx

  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Modal.tsx
    Tabs.tsx
    Badge.tsx
    Card.tsx
    Table.tsx
    Pagination.tsx

  charts/
    LineChart.tsx
    BarChart.tsx
    PieChart.tsx
    KPIWidget.tsx

  forms/
    Form.tsx
    FormField.tsx

  ai/
    AIDock.tsx
    AISuggestionPanel.tsx
    AIInsightCard.tsx

3.4 services/ — طبقة الإتصال مع الـ API
services/
  api-client.ts        # wrapper حول fetch / axios
  auth.service.ts
  products.service.ts
  pricing.service.ts
  crm.service.ts
  marketing.service.ts
  sales.service.ts
  dealers.service.ts
  stand.service.ts
  affiliate.service.ts
  loyalty.service.ts
  inventory.service.ts
  finance.service.ts
  partners.service.ts
  white-label.service.ts
  automation.service.ts
  communication.service.ts
  ai.service.ts


مبدأ:

كل خدمة تعطي دوال واضحة: getProducts, createProduct, getPricingAdvice…

3.5 lib/ — وظائف مساعدة في الواجهة
lib/
  routes.ts          # تعريف مسارات الـ nav
  format.ts          # تنسيقات التاريخ، المال…
  auth.ts            # Helpers لجلب session، حماية الصفحات
  ai.ts              # Helpers لاستدعاء ENDPOINTS تبع AI

3.6 hooks/ — React Hooks
hooks/
  useAuth.ts
  useCurrentBrand.ts
  useNotification.ts
  useAIContext.ts
  usePagination.ts
  useFilters.ts

🧠 4. Naming & Consistency Rules

Backend Modules

المجلد: pricing

الملفات:

pricing.controller.ts

pricing.service.ts

pricing.routes.ts

Frontend Pages

Route: /pricing/ai-advice

Folder: app/pricing/ai-advice/page.tsx

Types & DTOs

Backend: PricingInput, PricingResponse في pricing.types.ts

Frontend: يمكن مشاركة types في front-end/types/ إذا احتجنا.

API Paths

دائمًا /api/v1/{module}/...

مثال: /api/v1/pricing/advice

🧩 5. OS ↔ Module Mapping (Quick Reference)
OS / System	Backend Module Folder	Frontend Route Base
Auth & Users	auth, users	/login, /admin/users
Brand OS	brand	/brand
Product OS	product	/products
Pricing OS	pricing	/pricing
CRM OS	crm	/crm
Marketing OS	marketing	/marketing
Sales Rep OS	sales-reps	/sales
Dealer OS	dealers	/dealers
Stand Program OS	stand	/stand
Affiliate OS	affiliate	/affiliate
Loyalty OS	loyalty	/loyalty
Inventory OS	inventory	/inventory
Finance OS	finance	/finance
Partner Ecosystem OS	partners	/partners
White Label OS	white-label	/white-label
Automation OS	automation	/automation
Communication OS	communication	/communication
Knowledge Base OS	knowledge-base	/knowledge
Security & Governance	security-governance	/security
Admin / SuperAdmin OS	admin	/admin
AI Brain OS	ai-brain	/ai-brain
Social Intelligence OS	social-intelligence	/social-intelligence
Operations OS	operations	/operations (لو احتجنا)
Support / Ticketing OS	support	/support
Virtual HQ	(متعدد، AI Brain + Admin)	/virtual-hq