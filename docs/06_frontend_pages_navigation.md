MH-OS SUPERAPP — Frontend Pages & Navigation Index

Next.js App Router — Enterprise Modular UI Architecture

🎯 هدف هذا المستند

هذا المستند يقوم بـ:

تحديد جميع صفحات الواجهة الأمامية

تحديد بنية المجلدات داخل Next.js

تحديد نظام الـ Layouts

تحديد نظام الـ Navigation (Sidebar + Topbar + OS Switcher)

تحديد صفحات كل OS حسب المستندات السابقة

تحديد صفحات AI Crew + Virtual HQ

يعتبر هذا المستند المرجع الرسمي لبناء الـ Frontend.

🏗 1. Next.js Folder Structure — Master Layout
front-end/
  app/
    layout.tsx
    page.tsx
    
    (auth)/
      login/
      forgot-password/
      reset-password/

    dashboard/
      page.tsx

    brand/
      page.tsx

    products/
      ...
    
    pricing/
      ...
    
    crm/
      ...
    
    marketing/
      ...
    
    sales/
      ...

    dealers/
      ...

    stand/
      ...

    affiliate/
      ...

    loyalty/
      ...

    inventory/
      ...

    finance/
      ...

    partners/
      ...

    white-label/
      ...

    automation/
      ...

    communication/
      ...

    knowledge/
      ...

    security/
      ...

    admin/
      ...

    ai-brain/
      ...

    social-intelligence/
      ...

    virtual-hq/
      ...

  components/
  hooks/
  lib/
  services/
  styles/
  types/

🧱 2. Global Layout System
2.1 Root Layout

يحتوي على:

Global CSS (Tailwind)

Theme Provider

Auth Session Provider

AI Floating Dock Button

Toast Notifications

2.2 App Layout (Post Login)

موجود تحت:

app/dashboard/layout.tsx


يشمل:

✔ Sidebar Navigation

يعرض كل أنظمة الـ OS:

Dashboard

Brand

Products

Pricing

CRM

Marketing

Sales

Dealers

Stand

Affiliate

Loyalty

Inventory

Finance

Partners

White Label

Automation

Communication

Knowledge

AI Brain

Social Intelligence

Admin

Virtual HQ

✔ Top Bar

يشمل:

Brand Switcher

User Profile Menu

Notifications Badge

Quick Search (Ctrl+K)

AI Assistant Quick Actions

🗂 3. Frontend Navigation Tree (Full OS Map)
🏠 3.1 Dashboard
/dashboard


العناصر:

Global KPIs

AI Insights

Quick Actions

Notification Streams

OS Status Summary

Sales Today / This Week

Best Products

Inventory Alerts

AI Suggested Tasks

🧴 3.2 Brand OS Pages
/brand
/brand/identity
/brand/rules
/brand/ai-config


الصفحات:

Brand Overview

Brand Identity (Vision, Mission, Values…)

Rules & Guidelines

AI Config (Tone, Personality, Restrictions)

Brand Assets Viewer (Logo, Colors, Packaging)

🛒 3.3 Product OS Pages
/products
/products/[id]
/products/categories
/products/import
/products/documents


الصفحات:

Product List

Product Detail

Pricing Preview (Read-only)

Competitor Comparison

Product Documents (USP, HowToUse, Packaging)

CSV Import

Product Media Manager

💰 3.4 Pricing OS Pages
/pricing
/pricing/[productId]
/pricing/matrix
/pricing/competitors
/pricing/ai-advice
/pricing/ai-forecast
/pricing/history


الصفحات:

Product Pricing Overview

Multi-channel Matrix

Competitor Prices

AI Pricing Advisor

AI Pricing Forecast

Heatmap

Pricing History (AI + Human)

Draft Price Approvals

🧑‍💼 3.5 Sales Rep OS Pages
/sales
/sales/reps
/sales/reps/[id]
/sales/routes
/sales/visits
/sales/quotes
/sales/orders
/sales/kpi


الصفحات:

Reps Overview

Territories

Route Planner

Visits Logging

Quotes Builder

Orders

KPIs & Leaderboard

AI Visit Recommendations

🏪 3.6 Dealer OS Pages
/dealers
/dealers/[id]
/dealers/orders
/dealers/contracts


الصفحات:

Dealer List

Dealer Detail

Dealer Pricing

Dealer Orders

Dealer Activity Logs

AI Dealer Insights

🏬 3.7 Stand Program OS Pages
/stand
/stand/partners
/stand/[id]
/stand/inventory
/stand/orders


Stand Partners

Stand Units

Stand Inventory

Stand Orders

Stand Loyalty Points

AI Refill Suggestions

🤝 3.8 Partner Ecosystem OS
/partners
/partners/[id]


Unified Partner List (Dealer + Distributor + Salon + WL Owner)

Partner Analytics

Partner AI Report

🎁 3.9 Affiliate OS
/affiliate
/affiliate/[id]
/affiliate/links
/affiliate/payouts


Affiliates & Influencers

Affiliate Performance

Links Manager

Payouts

AI Influencer Finder

🎮 3.10 Loyalty OS
/loyalty
/loyalty/programs
/loyalty/customers
/loyalty/transactions
/rewards


Programs

Tiers

Customers

Transactions

Rewards

AI Loyalty Suggestions

📦 3.11 Inventory OS
/inventory
/inventory/warehouses
/inventory/stock
/inventory/movements
/inventory/forecast


Stock Levels

Movements

Purchase Orders

Shipments

AI Demand Forecast

💵 3.12 Finance OS
/finance
/finance/invoices
/finance/payments
/finance/expenses
/finance/payouts
/finance/kpi


Finance Overview

Invoices

Payments

Expenses

Program Payouts

COGS Maps

Profitability Analytics

🧩 3.13 White Label OS
/white-label
/white-label/brands
/white-label/[id]
/white-label/orders
/white-label/configurator


WL Brands

WL Products

WL Orders

WL Configurator

WL AI Growth Advisor

⚙️ 3.14 Automation OS
/automation
/automation/events
/automation/rules
/automation/workflows


Event Triggers

Rules Builder

Workflow Designer

Test Trigger

AI Auto-Rule Assistant

📡 3.15 Communication OS
/communication
/templates
/messages


Templates

Notification Log

Multi-channel Messaging

📚 3.16 Knowledge Base OS
/knowledge
/knowledge/docs
/knowledge/categories


Documents

Categories

AI Knowledge Search

🛡 3.17 Security & Governance OS
/security
/security/roles
/security/policies
/security/audit


Roles

Permissions

Policies

Audit Logs

🛠 3.18 Admin / SuperAdmin OS
/admin
/admin/brands
/admin/users
/admin/settings
/admin/ai
/admin/system-health


Users

Brands

System Settings

AI Governance

System Health Monitor

🤖 3.19 AI Brain OS
/ai-brain
/ai-brain/agents
/ai-brain/reports


AI Agents

AI Reports

AI Task Center

🌍 3.20 Social Intelligence OS
/social-intelligence
/trends
/influencers
/mentions


Social Listening

Trend Radar

Influencer Intelligence

🏢 3.21 Virtual HQ (AI Workforce)
/virtual-hq
/virtual-hq/inbox
/virtual-hq/analytics
/virtual-hq/reports


AI Crew Dashboard

AI Task Inbox

AI Global Reports

Executive AI Assistant

🧠 4. AI Assistant Dock (Global)

يظهر في كل الصفحات:

AI Quick Actions

Summaries

Recommendations

Explain This Page

Search Knowledge

Create Task

Open Automation Builder

🎨 5. UI Patterns (اختصار)
Components folder:
components/
  ui/
  charts/
  tables/
  forms/
  layout/
  ai/

Shared services:
services/
  api/
  auth.ts
  pricing.ts
  crm.ts
  ...

🧩 6. Navigation Rules

كل OS مستقل في navigation

كل OS له:

Dashboard

List

Detail

AI Panel

Settings (إن وجد)

Multi-Brand Switcher في TopBar

AI Dock موجود دائمًا