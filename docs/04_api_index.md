📘 04_api_index.md
MH-OS SUPERAPP — Global API Index (Master API Directory)

الفهرس الرسمي لجميع الـ API Endpoints في النظام

🧱 1. مقدمة

هذا المستند يجمع كل API سيحتاجه MH-OS SUPERAPP، مصنّف حسب الـ OS، بطريقة موحدة واحترافية.

الأهداف:

توفير خريطة موحّدة لجميع المسارات الخلفية

ضمان الاتساق بين جميع أنظمة المنصة

مرجع يستخدمه Codex لتوليد الخدمات والواجهات

مرجع للمطورين والـ AI Agents والـ Automation Engine

جميع الـ API تبدأ دائماً بـ:

/api/v1/


وكل OS يملك namespace مستقل.

🧩 2. قواعد التصميم (API Design Principles)
RESTful

كل API يجب أن يكون REST، واضح، قياسي، لا يعتمد على GraphQL في V1.

Naming Convention
GET    /api/v1/{os}/list
GET    /api/v1/{os}/details/:id
POST   /api/v1/{os}/create
PUT    /api/v1/{os}/update/:id
DELETE /api/v1/{os}/delete/:id
GET    /api/v1/{os}/search

AI Endpoints

كل OS يدعم الذكاء الاصطناعي من خلال namespace ثابت:

/api/v1/{os}/ai/*

Automation Endpoints

لكل OS مساحة خاصة للأتمتة:

/api/v1/{os}/automation/*

Security Rules

بعض المسارات محمية عبر RBAC

بعضها محظور على الـ AI

بعضها يحتاج موافقة بشرية (Admin Approval Layer)

🗂 3. فهرس الـ API حسب الـ OS
🅰 A — Brand OS
GET     /api/v1/brand/list
GET     /api/v1/brand/details/:id
POST    /api/v1/brand/create
PUT     /api/v1/brand/update/:id
DELETE  /api/v1/brand/delete/:id

GET     /api/v1/brand/identity/:id
PUT     /api/v1/brand/identity/update/:id

GET     /api/v1/brand/rules/:id
PUT     /api/v1/brand/rules/update/:id

GET     /api/v1/brand/ai-config/:id
PUT     /api/v1/brand/ai-config/update/:id

🅱 B — Product OS
GET     /api/v1/product/list
GET     /api/v1/product/details/:id
POST    /api/v1/product/create
PUT     /api/v1/product/update/:id
DELETE  /api/v1/product/delete/:id

GET     /api/v1/product/category/list
POST    /api/v1/product/category/create

POST    /api/v1/product/import
GET     /api/v1/product/export


AI:

POST    /api/v1/product/ai/description
POST    /api/v1/product/ai/how-to-use
POST    /api/v1/product/ai/usp
POST    /api/v1/product/ai/content

🅲 C — Pricing OS
GET     /api/v1/pricing/base/:productId
POST    /api/v1/pricing/update/:productId
POST    /api/v1/pricing/draft/save
GET     /api/v1/pricing/matrix/:productId
GET     /api/v1/pricing/competitors/:productId
POST    /api/v1/pricing/competitors/update


AI:

POST    /api/v1/pricing/ai/advice
POST    /api/v1/pricing/ai/forecast
POST    /api/v1/pricing/ai/competitor-strategy
POST    /api/v1/pricing/ai/heatmap
POST    /api/v1/pricing/ai/reprice


Automation:

POST    /api/v1/pricing/automation/on-price-change
POST    /api/v1/pricing/automation/on-competitor-change

🅳 D — Sales Rep OS
GET     /api/v1/sales-reps/list
GET     /api/v1/sales-reps/details/:id
POST    /api/v1/sales-reps/create
PUT     /api/v1/sales-reps/update/:id
DELETE  /api/v1/sales-reps/delete/:id

POST    /api/v1/sales-reps/route-plan
POST    /api/v1/sales-reps/visit
POST    /api/v1/sales-reps/quote
POST    /api/v1/sales-reps/order


AI:

POST    /api/v1/sales-reps/ai/route-optimization
POST    /api/v1/sales-reps/ai/visit-advice
POST    /api/v1/sales-reps/ai/performance-insights

🅴 E — Dealer OS
GET    /api/v1/dealers/list
GET    /api/v1/dealers/details/:id
POST   /api/v1/dealers/create
PUT    /api/v1/dealers/update/:id
POST   /api/v1/dealers/order
GET    /api/v1/dealers/orders/:dealerId


AI:

POST   /api/v1/dealers/ai/insights
POST   /api/v1/dealers/ai/re-order-suggestion

🅵 F — Stand Program OS
GET     /api/v1/stand/list
GET     /api/v1/stand/details/:id
POST    /api/v1/stand/create
POST    /api/v1/stand/refill
POST    /api/v1/stand/sales-record
GET     /api/v1/stand/performance/:id


AI:

POST    /api/v1/stand/ai/refill-forecast
POST    /api/v1/stand/ai/performance-insights
POST    /api/v1/stand/ai/location-expansion

🅶 G — Affiliate OS
GET     /api/v1/affiliate/list
POST    /api/v1/affiliate/create
GET     /api/v1/affiliate/stats/:id
POST    /api/v1/affiliate/payout


AI:

POST    /api/v1/affiliate/ai/find-influencers
POST    /api/v1/affiliate/ai/performance
POST    /api/v1/affiliate/ai/fraud-detection

🅷 H — Loyalty OS
GET     /api/v1/loyalty/programs
POST    /api/v1/loyalty/create
POST    /api/v1/loyalty/add-points
POST    /api/v1/loyalty/redeem
GET     /api/v1/loyalty/history/:userId


AI:

POST    /api/v1/loyalty/ai/reward-recommendation
POST    /api/v1/loyalty/ai/churn-risk

🅸 I — CRM OS
GET     /api/v1/crm/contacts
POST    /api/v1/crm/lead/create
PUT     /api/v1/crm/lead/update/:id
POST    /api/v1/crm/deal/create
POST    /api/v1/crm/task/create


AI:

POST    /api/v1/crm/ai/next-actions
POST    /api/v1/crm/ai/lead-score
POST    /api/v1/crm/ai/follow-up

🅹 J — Marketing OS
GET     /api/v1/marketing/content-plan
POST    /api/v1/marketing/content/create
POST    /api/v1/marketing/campaign/create
GET     /api/v1/marketing/campaign/metrics/:id


AI:

POST    /api/v1/marketing/ai/content-ideas
POST    /api/v1/marketing/ai/seo
POST    /api/v1/marketing/ai/media-buying
POST    /api/v1/marketing/ai/performance-review

🅺 K — Inventory OS
GET     /api/v1/inventory/list
POST    /api/v1/inventory/movement
POST    /api/v1/inventory/reorder


AI:

POST    /api/v1/inventory/ai/forecast

🅻 L — Finance OS
POST    /api/v1/finance/invoice
POST    /api/v1/finance/payment
GET     /api/v1/finance/summary
GET     /api/v1/finance/pnl


AI:

POST    /api/v1/finance/ai/profitability
POST    /api/v1/finance/ai/forecast

🅼 M — White Label OS
POST    /api/v1/white-label/brand/create
POST    /api/v1/white-label/product/create
POST    /api/v1/white-label/order
GET     /api/v1/white-label/store/:id


AI:

POST    /api/v1/white-label/ai/brand-builder
POST    /api/v1/white-label/ai/product-generator
POST    /api/v1/white-label/ai/launch-plan

🅽 N — Automation OS
GET     /api/v1/automation/events
POST    /api/v1/automation/rule
POST    /api/v1/automation/workflow
POST    /api/v1/automation/test-trigger

🅾 O — Communication OS
POST    /api/v1/communication/send
GET     /api/v1/communication/templates


AI:

POST    /api/v1/communication/ai/generate-template

🅿 P — Knowledge Base OS
GET     /api/v1/knowledge/list
POST    /api/v1/knowledge/create

🆀 Q — Security & Governance OS
GET     /api/v1/security/users
POST    /api/v1/security/role
POST    /api/v1/security/policy
GET     /api/v1/security/audit-log

🆁 R — Admin / SuperAdmin OS
GET     /api/v1/admin/system-status
POST    /api/v1/admin/brand/activate
POST    /api/v1/admin/module/toggle
POST    /api/v1/admin/ai-config/update

🆂 S — AI Brain OS
GET     /api/v1/ai/agents
POST    /api/v1/ai/run
POST    /api/v1/ai/report

✔ انتهى API Index الرسمي