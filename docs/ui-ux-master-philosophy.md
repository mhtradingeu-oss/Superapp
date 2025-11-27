MH-OS Admin — UI/UX Master Philosophy (v1.0)

A global design doctrine for intelligent admin dashboards

1. الهدف الرئيسي

بناء لوحة تحكم عالمية المستوى تقدم:
• وضوح المعلومات
• سرعة التفاعل
• تكامل الذكاء الاصطناعي
• مرونة الاستخدام
• جمال بصري
• ثبات على كل الشاشات

وتكون مرجعًا لبقية منتجات MH-OS:
(لوحة المستخدم – المتجر – CRM – التسويق – التسعير – التشغيل).

2. المبادئ الأساسية
2.1 Clarity First

المعلومات تُعرَض فقط عند الحاجة.
يُستخدم اللون والحجم والفراغ لشرح الأولويات.

2.2 Consistency Always

كل صفحة تبدأ بـ PageHeader:

عنوان

وصف

Actions

InfoTooltip

Breadcrumbs

2.3 AI Everywhere

الذكاء الاصطناعي جزء من الواجهة:

Generative buttons

Quick fills

Insights

Helper tooltips

Narrative cards

Auto-suggestions

2.4 Feedback in Every Interaction

كل فعل يجب أن يرد بـ:
Toast — Skeleton — Loading — Empty — Error

2.5 Beauty With Purpose

جمال الواجهة يجب أن يخدم العمل:
• ظلال دقيقة
• حواف ناعمة
• تحريك بسيط
• Gradients ذكي
• Glass background

3. بنية الواجهة الموحدة
3.1 Sidebar Navigation

Collapsible

Icons + labels

Grouped sections

Active state واضح

Keyboard friendly

3.2 Topbar

Global Search

Notifications

Theme Switch

Account menu

Brand selector

3.3 Content Layout

كل صفحة يجب أن تتكون من:

PageHeader

Filters

Main content

Empty/Error handling

AI helper section

4. المكوّنات الأساسية (Primitives)

PageHeader

InfoTooltip

Badge

Card

EmptyState

Table unified

Form unified (RHF + Zod)

Skeleton

Modal

Drawer

Chart wrapper

AI Panel

5. صفحات العمليات (OPS)
5.1 Notifications

Bell + live dropdown

Center page

Filtering (read/unread/type/module/action)

Mark all

Pagination

AI summarize notifications

5.2 Activity

Timeline grouped by date

Category colors

AI narrative summary

Filters

Pagination

5.3 Automations

List

Wizard builder

AI suggest rule

Logs

Status control

6. لوحة التحكم (Overview Dashboard)

KPI Deck

Revenue

CRM

Pricing

Inventory

Loyalty

AI Narrative

Quick Actions

Recent Activity

Brand Summary

Health Score

7. تطبيقات الذكاء الاصطناعي

AI HQ

Insights

Reports

AI Agents

Assistant

كلها تعتمد على PageHeader + Filters + Tables + Detail panels.

8. قابلية التوسع

كل الواجهة مصممة لتكون قابلة:
• للعلامات التجارية المتعددة
• للمستخدمين المتعددين
• للأدوار المختلفة
• للإضافات المستقبلية

9. الجودة
Developer Experience

Folder structure ثابت

Reusable components

Strong typing

No duplicated logic

API clients منفصلة

unified error handling

Testing

Type safety

Snapshot UI

Integration flows

AI prompt validation

10. الخلاصة

هذه الوثيقة هي المرجع النهائي لبناء واجهة MH-OS Admin —
لوحة قيادة عالمية تجمع:
القوة | الذكاء | الوضوح | الجمال | البساطة | الاتساق