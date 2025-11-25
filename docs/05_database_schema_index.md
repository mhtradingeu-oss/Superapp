MH-OS SUPERAPP — Database Schema Index (Prisma Models Map)

هذا المستند هو خريطة قاعدة البيانات الرسمية للمشروع.
لا يحتوي على كود Prisma جاهز، بل:

أسماء الجداول / النماذج (Models)

الغرض من كل Model

الحقول الأساسية (Key Fields)

العلاقات المهمة بين النماذج

سيُستخدم لاحقًا كمرجع عند كتابة schema.prisma الفعلي.

✅ القاعدة الذهبية:
كل Model تقريبًا يلتزم بـ:

id String @id @default(cuid())

createdAt DateTime @default(now())

updatedAt DateTime @updatedAt

🧱 1. قواعد عامة (Global Conventions)
1.1 Primary Keys

كل Model رئيسي:

id: String @id @default(cuid())

لا نستخدم أرقام متسلسلة Int @id في V1 لتسهيل الدمج بين البيئات.

1.2 تواريخ الإنشاء والتحديث

كل Model تقريباً يحتوي:

createdAt: DateTime @default(now())

updatedAt: DateTime @updatedAt

1.3 Multi-Brand / Multi-Tenant

معظم النماذج التجارية ستكون مرتبطة ببراند عبر:

brandId String?

brand Brand? @relation(fields: [brandId], references: [id])

أو أحيانًا عبر Partner/Company.

1.4 علاقات أساسية متكررة

User يرتبط بـ:

Partner, SalesRep, DealerUser, StandUser, AffiliateUser…

BrandProduct هو القلب لكثير من الأنظمة:

Pricing, Inventory, Orders, Stand, WL, CRM، إلخ.

🧩 2. Core & Brand Foundation Models
2.1 User

يمثل أي مستخدم داخل النظام (SuperAdmin, BrandAdmin, SalesRep, Dealer, …).

Fields (رئيسية):

id

email (unique)

passwordHash

name

role (enum أو FK لجدول Role)

status (ACTIVE, SUSPENDED,…)

lastLoginAt

createdAt, updatedAt

2.2 Role (إن استُخدم كجدول بدل enum فقط)

id

name (e.g. SUPER_ADMIN, BRAND_MANAGER,…)

description

2.3 Brand

يمثل البراند (HAIROTICMEN، وغيرها).

id

name

slug (unique)

description

countryOfOrigin

defaultCurrency

settingsJson (Optional)

createdAt, updatedAt

2.4 BrandIdentity

كل ما يتعلق بالهوية:

id

brandId → Brand

vision

mission

values

toneOfVoice

persona

brandStory

keywords

colorPalette

packagingStyle

socialProfilesJson

createdAt, updatedAt

2.5 BrandRules

قواعد عامة للبراند:

id

brandId → Brand

namingRules

descriptionRules

marketingRules

discountRules

pricingConstraints

restrictedWords

allowedWords

aiRestrictions

createdAt, updatedAt

2.6 BrandAIConfig

إعدادات الذكاء الاصطناعي للبراند:

id

brandId → Brand

aiPersonality

aiTone

aiContentStyle

aiPricingStyle

aiEnabledActionsJson

aiBlockedTopicsJson

aiModelVersion

createdAt, updatedAt

🧴 3. Product OS Models
3.1 BrandCategory

تصنيف المنتجات داخل البراند.

id

brandId → Brand

name

slug

description

createdAt, updatedAt

3.2 BrandProduct

المنتج الرئيسي (SKU أو مجموعة SKUs حسب التصميم).

id

brandId → Brand

categoryId → BrandCategory

name

slug

description

sku (unique إذا كان لكل منتج SKU واحد)

upc / ean

line (Premium, Professional,…)

status (ACTIVE, DISCONTINUED,…)

weightGrams

netContentMl

unitsPerCarton

imageUrl

qrUrl

روابط للملفات:

howToUseDocId (اختياري → KnowledgeDocument)

uspDocId (اختياري)

packagingDocId

regulatoryDocId

createdAt, updatedAt

3.3 ProductPricing

تسعير المنتج لكل القنوات.

id

productId → BrandProduct (unique)

Cost Fields:

factoryPriceUnit

totalFactoryPriceCarton

eprLucidPerUnit

shippingInboundPerUnit

gs1PerUnit

retailPackagingPerUnit

qcPifPerUnit

operationsPerUnit

marketingPerUnit

cogsEur

fullCostEur

Channels Pricing:

b2cStoreNet

b2cStoreInc

b2cMarginPct

amazonNet

amazonInc

amazonMarginPct

dealerBasicNet

dealerPlusNet

standPartnerNet

distributorNet

map

uvpNet

uvpInc

vatPct

grundpreis (String)

createdAt, updatedAt

3.4 CompetitorPrice

أسعار المنافسين لنفس المنتج أو منتج مشابه.

id

productId → BrandProduct

competitorName

marketplace (Amazon, DM, Rossmann,…)

country

url

priceNet

priceGross

currency

collectedAt

sourceType (Scraper, Manual, API,…)

createdAt, updatedAt

3.5 ProductPriceDraft

مسودة أسعار (قبل الاعتماد).

id

productId → BrandProduct

channel (B2C, AMAZON, DEALER_BASIC,…)

oldNet, oldGross, oldMargin

newNet, newGross, newMargin

changePct

status (DRAFT, APPROVED, REJECTED, APPLIED)

createdByUserId → User

approvedByUserId → User?

notes

createdAt, updatedAt

3.6 AIPricingHistory

تاريخ قرارات التسعير من الـ AI.

id

productId → BrandProduct

channel

oldNet

newNet

aiAgentName

confidenceScore

reasonSummary

impactEstimateJson (توقعات AI)

resultSummaryJson (بعد فترة – من الـ Learning Loop)

createdAt, updatedAt

3.7 AILearningJournal

دفتر تعلم AI للتسعير.

id

productId → BrandProduct

source (PRICING, CAMPAIGN, INVENTORY,…)

eventType

inputSnapshotJson

outputSnapshotJson

actualResultJson

aiAdjustmentJson (كيف عدّل الأوزان)

createdAt, updatedAt

🤝 4. CRM OS Models
4.1 Person

شخص (عميل، lead، influencer، salon owner،…).

id

firstName, lastName

email

phone

country, city

tags

source

createdAt, updatedAt

4.2 Company

شركة أو صالون أو صيدلية أو تاجر.

id

name

type (Salon, Pharmacy, Distributor, Retailer,…)

vatNumber

country, city

website

tags

createdAt, updatedAt

4.3 Lead

Lead CRM عام.

id

personId → Person?

companyId → Company?

source (Social, Ads, Referral, Stand, Affiliate,…)

status (NEW, QUALIFIED, LOST,…)

score

pipelineId → Pipeline

stageId → PipelineStage

assignedToUserId → User

createdAt, updatedAt

4.4 Pipeline & PipelineStage

Pipeline:

id

name

type (B2C, Dealer, WL,…)

PipelineStage:

id

pipelineId

name

order

4.5 Deal & DealProduct

Deal:

id

leadId / companyId

title

value

currency

status

expectedCloseDate

ownerId

DealProduct:

id

dealId

productId

quantity

price

4.6 CRMSegment / SmartList

id

name

filtersJson

createdByUserId

4.7 CRMTask / CRMNote / InteractionLog

Tasks & Notes & Logs.

CRMTask:

id, title, dueDate, status, assignedToUserId

CRMNote:

id, entityType, entityId, content

InteractionLog:

id, channel (WhatsApp, Call,…), direction, summary, metaJson

📣 5. Marketing OS Models
5.1 MarketingChannel

id

name (Facebook Ads, TikTok, Google Ads,…)

type (PAID, ORGANIC, EMAIL, SMS, INFLUENCER,…)

5.2 ContentPlan & ContentPlanItem

ContentPlan:

id, brandId, name, periodStart, periodEnd

ContentPlanItem:

id, contentPlanId, channelId, topic, format, status, scheduledAt

5.3 Campaign, CampaignAdSet, CampaignAd

Campaign:

id, brandId, name, objective, budget, status

CampaignAdSet:

id, campaignId, audienceJson, placementJson

CampaignAd:

id, adSetId, creativeId, status

5.4 MarketingPerformanceLog

id

campaignId

date

impressions

clicks

spend

conversions

revenue

kpiJson

🧾 6. Sales Rep OS Models
6.1 SalesRep

id

userId → User

code

region

status

kpiTargetMonthlyJson

createdAt, updatedAt

6.2 SalesTerritory & SalesRepTerritoryAssignment

SalesTerritory:

id, name, country, city

SalesRepTerritoryAssignment:

id, repId, territoryId

6.3 SalesRoutePlan & SalesRouteStop

SalesRoutePlan:

id, repId, date

SalesRouteStop:

id, routePlanId, partnerId / dealerId, orderIndex, status

6.4 SalesVisit & SalesVisitNote

SalesVisit:

id, repId, partnerId, date, purpose, result

SalesVisitNote:

id, visitId, content

6.5 SalesQuote & SalesQuoteItem

SalesQuote:

id, repId, partnerId, status, validUntil, total

SalesQuoteItem:

id, quoteId, productId, quantity, price

6.6 SalesOrder & SalesOrderItem

SalesOrder:

id, repId?, dealerId?, standPartnerId?, status, total

SalesOrderItem:

id, orderId, productId, quantity, price

🧑‍💼 7. Dealer / Partner Ecosystem OS
7.1 Partner

كيان عام لأي شريك (Dealer, Distributor, Salon, Pharmacy,…).

id

brandId?

type (DEALER, DISTRIBUTOR, SALON, PHARMACY, RETAIL_CHAIN,…)

name

country, city

vatNumber

contactPersonId

status

tier

settingsJson

createdAt, updatedAt

7.2 Dealer (إن كان مستقلاً) أو يستخدم Partner مباشرة

إذا استخدمنا Dealer كـ specialization:

id

partnerId

dealerCode

priceListJson

creditLimit

paymentTerms

7.3 PartnerContract / PartnerPricing / PartnerOrder

PartnerContract:

id, partnerId, startDate, endDate, termsJson

PartnerPricing:

id, partnerId, productId, netPrice, currency

PartnerOrder:

id, partnerId, status, total

PartnerOrderItem:

id, orderId, productId, quantity, price

🏪 8. Stand Program OS
8.1 StandPartner

id

partnerId → Partner

standType (Kiosk, Corner, Shelf,…)

locationAddress

city, country

status

createdAt, updatedAt

8.2 StandUnit

إذا أردنا تمييز كل وحدة Stand:

id

standPartnerId

code

locationDescription

status

8.3 StandInventory / StandInventorySnapshot

StandInventory:

id, standUnitId, productId, quantity

StandInventorySnapshot:

id, standUnitId, snapshotAt, dataJson

8.4 StandOrder & StandOrderItem

StandOrder:

id, standPartnerId, status, total

StandOrderItem:

id, orderId, productId, quantity, price

🌐 9. Affiliate OS
9.1 Affiliate

id

userId? أو personId

code

type (INFLUENCER, AFFILIATE, WL_AFFILIATE,…)

channel (TikTok, IG, YouTube,…)

profileUrl

status

createdAt, updatedAt

9.2 AffiliateLink / AffiliatePerformance / AffiliatePayout

AffiliateLink:

id, affiliateId, linkCode, targetUrl

AffiliatePerformance:

id, affiliateId, periodStart, periodEnd, clicks, orders, revenue

AffiliatePayout:

id, affiliateId, amount, currency, status, paidAt

🎁 10. Loyalty OS
10.1 LoyaltyProgram

id

brandId

name

type (B2C, DEALER, STAND,…)

rulesJson

10.2 LoyaltyCustomer

يمكن الربط بـ User أو Person:

id

userId? / personId?

programId

pointsBalance

tierId

10.3 LoyaltyTransaction & RewardRedemption

LoyaltyTransaction:

id, customerId, programId, pointsChange, reason, sourceEntityType, sourceEntityId

RewardRedemption:

id, customerId, rewardId, pointsSpent, status

📦 11. Inventory & Fulfillment OS
11.1 Warehouse

id

name

location

type (MAIN, REGIONAL, 3PL,…)

11.2 InventoryItem & InventoryTransaction

InventoryItem:

id, warehouseId, productId, quantity

InventoryTransaction:

id, warehouseId, productId, type (IN, OUT, ADJUSTMENT,…), quantity, reason

11.3 PurchaseOrder / Shipment

PurchaseOrder:

id, supplierId?, status, total

PurchaseOrderItem:

id, purchaseOrderId, productId, quantity, cost

Shipment:

id, fromWarehouseId?, toWarehouseId?, status

ShipmentItem:

id, shipmentId, productId, quantity

💰 12. Finance OS
12.1 Invoice / InvoiceItem

Invoice:

id, customerType (B2C, PARTNER,…), customerId, status, totalNet, totalGross, currency

InvoiceItem:

id, invoiceId, productId, quantity, unitPriceNet, vatPct

12.2 Payment / Expense / RevenueRecord

Payment:

id, invoiceId, amount, method, status

Expense:

id, category, amount, currency, note

RevenueRecord:

id, productId?, channel, amount, currency, periodStart, periodEnd

🏷 13. White Label OS
13.1 WhiteLabelBrand

id

ownerPartnerId أو ownerAffiliateId

name

slug

status

settingsJson

createdAt, updatedAt

13.2 WhiteLabelProduct / WhiteLabelOrder

WhiteLabelProduct:

id, wlBrandId, baseProductId (اختياري), name, sku, pricingJson

WhiteLabelOrder:

id, wlBrandId, status, total

🤖 14. Automation OS
14.1 AutomationEvent / AutomationRule / AutomationWorkflow

AutomationEvent:

id, name, sourceOS, payloadSchemaJson

AutomationRule:

id, name, triggerEvent, conditionsJson, actionsJson, enabled

AutomationWorkflow:

id, name, stepsJson, enabled

14.2 AutomationLog / ScheduledJob

AutomationLog:

id, eventName, ruleId, result, detailsJson

ScheduledJob:

id, name, cronExpression, lastRunAt, nextRunAt, status

📩 15. Communication OS
15.1 Notification / NotificationTemplate

Notification:

id, userId, channel, title, body, status, metaJson

NotificationTemplate:

id, code, channel, subject, body, variablesJson

📚 16. Knowledge Base OS
16.1 KnowledgeDocument

id

title

category

tags

sourceType (Manual, PDF, System,…)

content

language

createdAt, updatedAt

🛡 17. Security & Governance OS
17.1 Permission / RolePermission / Policy / AuditLog

Permission:

id, code, description

RolePermission:

id, roleId, permissionId

Policy:

id, name, rulesJson

AIRestrictionPolicy:

id, name, rulesJson

AuditLog:

id, userId, action, entityType, entityId, metadataJson, createdAt

🧠 18. AI Brain & Social Intelligence
18.1 AIAgentConfig

id

name (AI_CMO, AI_PRICING_ENGINE,…)

osScope (Marketing, Pricing,…)

configJson

enabled

18.2 AIInsight / AIReport

AIInsight:

id, os, entityType, entityId, summary, detailsJson

AIReport:

id, title, scope, periodStart, periodEnd, content

18.3 SocialMention / SocialTrend / InfluencerProfile

SocialMention:

id, platform, author, content, sentiment, url, occurredAt

SocialTrend:

id, topic, platform, score, trendDataJson

InfluencerProfile:

id, handle, platform, followers, engagementRate, profileUrl, tags

🧰 19. Operations / Support / Others
19.1 Ticket

لدعم العملاء / الشركاء.

id

createdByUserId أو contactId

assignedToUserId

status

priority

category

description

createdAt, updatedAt