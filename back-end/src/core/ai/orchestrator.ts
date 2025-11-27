import { prisma } from "../prisma.js";
import { SimpleCache, hashPayload, safeAIRequest } from "./ai-utils.js";
import {
  assistantTemplate,
  brandReportTemplate,
  crmInsightTemplate,
  inventoryInsightTemplate,
  kpiNarrativeTemplate,
  loyaltyInsightTemplate,
  marketingInsightTemplate,
  pricingInsightTemplate,
  pricingSuggestionTemplate,
  salesRepPlanTemplate,
  standStockSuggestionTemplate,
  virtualOfficeMeetingTemplate,
} from "./prompt-templates.js";
import type {
  BrandHealthInput,
  BrandHealthOutput,
  CampaignIdeasInput,
  CampaignIdeasOutput,
  KpiNarrativeInput,
  KpiNarrativeOutput,
  LeadFollowupInput,
  LeadFollowupOutput,
  PricingSuggestionInput,
  PricingSuggestionOutput,
  SalesLeadAiContext,
  SalesRepPlanInput,
  SalesRepPlanOutput,
  StandInventoryContext,
  StandStockSuggestionInput,
  StandStockSuggestionOutput,
  VirtualOfficeMeetingRequest,
  VirtualOfficeMeetingSummary,
} from "../../modules/ai-brain/ai-brain.types.js";

const cache = new SimpleCache<any>(60_000);
const brandContextCache = new SimpleCache<Record<string, unknown>>(60_000);

function tryParseJson(value?: string | null) {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export class AiOrchestrator {
  async generatePricingSuggestion(input: PricingSuggestionInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "pricing");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<PricingSuggestionOutput>(
      "pricing-suggest",
      pricingSuggestionTemplate({ ...input, agent, ...brandContext }),
      {
        suggestedPrice: input.currentPrice ?? null,
        reasoning: "Using last known price",
        riskLevel: "MEDIUM",
        competitorSummary: input.competitorSummary,
        confidenceScore: 0.4,
      },
    );
  }

  async generatePricingInsight(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "pricing");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("pricing", pricingInsightTemplate({ ...context, agent, ...brandContext }), {
      summary: "Pricing steady",
      riskLevel: "MEDIUM",
      recommendation: "Monitor competitors",
      confidence: 0.5,
    });
  }

  async generateMarketingInsight(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "marketing");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("marketing", marketingInsightTemplate({ ...context, agent, ...brandContext }), {
      summary: "No marketing data",
      channels: [],
      recommendation: "Collect data",
    });
  }

  async generateCampaignIdeas(input: CampaignIdeasInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "marketing");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<CampaignIdeasOutput>(
      "campaign-ideas",
      marketingInsightTemplate({ ...input, agent, ...brandContext }),
      {
        headline: input.goal,
        body: "Draft campaign copy",
        cta: "Learn more",
        keywords: [input.goal],
      },
    );
  }

  async generateCRMInsight(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "crm");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("crm", crmInsightTemplate({ ...context, agent, ...brandContext }), {
      summary: "Lead health unknown",
      nextAction: "Follow up manually",
      score: 40,
    });
  }

  async generateSalesRepPlan(input: SalesRepPlanInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "sales");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<SalesRepPlanOutput>(
      "sales-plan",
      salesRepPlanTemplate({ ...input, agent, ...brandContext }),
      this.buildSalesPlanFallback(input.leads),
    );
  }

  async generateLeadFollowupSuggestions(input: LeadFollowupInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "crm");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<LeadFollowupOutput>(
      "crm-followup",
      crmInsightTemplate({ ...input, agent, ...brandContext }),
      {
        summary: "Follow up suggested",
        nextAction: "Email the lead",
        probability: 0.5,
        reasons: ["Fallback suggestion"],
      },
    );
  }

  async generateInventoryInsight(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "inventory");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("inventory", inventoryInsightTemplate({ ...context, agent, ...brandContext }), {
      summary: "Inventory status pending",
      risk: "MEDIUM",
      recommendation: "Audit stock",
    });
  }

  async generateStandStockSuggestion(input: StandStockSuggestionInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "inventory");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<StandStockSuggestionOutput>(
      "stand-stock",
      standStockSuggestionTemplate({ ...input, agent, ...brandContext }),
      this.buildStandStockFallback(input.inventorySnapshot),
    );
  }

  async generateLoyaltyInsight(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "loyalty");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("loyalty", loyaltyInsightTemplate({ ...context, agent, ...brandContext }), {
      summary: "Loyalty engagement unclear",
      action: "Review rewards",
    });
  }

  async generateKPINarrative(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "kpi");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("kpi", kpiNarrativeTemplate({ ...context, agent, ...brandContext }), {
      overview: "No KPI data",
      highlights: [],
      risks: [],
      nextSteps: [],
    });
  }

  async generateKpiNarrativeTyped(input: KpiNarrativeInput) {
    const agent = await this.getAgent(input.brandId, input.agentName ?? "kpi");
    const brandContext = await this.getBrandContext(input.brandId);
    return this.run<KpiNarrativeOutput>(
      "kpi-narrative",
      kpiNarrativeTemplate({ ...input, agent, ...brandContext }),
      {
        overview: "No KPI data",
        highlights: [],
        risks: [],
        nextSteps: [],
      },
    );
  }

  async generateFullBrandReport(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "report");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("report", brandReportTemplate({ ...context, agent, ...brandContext }), {
      title: "Brand Report",
      sections: [],
      summary: "No data",
    });
  }

  async assistantChat(context: Record<string, unknown>) {
    const agent = await this.getAgent(context.brandId, "assistant");
    const brandContext = await this.getBrandContext(context.brandId);
    return this.run("assistant", assistantTemplate({ ...context, agent, ...brandContext }), { reply: "How can I help?" });
  }

  async runVirtualOfficeMeeting(input: VirtualOfficeMeetingRequest) {
    const brandContext = await this.getBrandContext(input.brandId);
    const baseSummary: VirtualOfficeMeetingSummary = {
      summary: `Fast sync on ${input.topic}`,
      topic: input.topic,
      scope: input.scope,
      departments: input.departments,
      recommendations: input.departments.map((dept) => ({
        department: dept,
        headline: `${dept.toUpperCase()} priorities locked`,
        summary: `Align ${dept} tasks to unblock launch and revenue.`,
        actionItems: [
          {
            department: dept,
            task: `Ship the next ${dept} milestone for ${brandContext?.brandName ?? "the brand"}`,
            owner: "AI Lead",
            impact: "Keeps momentum and learning loops alive",
          },
        ],
      })),
      agenda: (input.agenda ?? []).map((title) => ({
        title,
        desiredOutcome: "Clarified next action",
      })),
      actionItems: input.departments.map((dept) => ({
        department: dept,
        task: `Prepare ${dept} update for leadership`,
        owner: "AI Coordinator",
        dueDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      })),
      risks: ["Fallback summary generated - wire live AI for richer narratives"],
    };

    if (typeof (brandContext as Record<string, unknown>).brandName === "string") {
      const slug = typeof (brandContext as Record<string, unknown>).brandSlug === "string" ? ((brandContext as Record<string, unknown>).brandSlug as string) : undefined;
      const brandId =
        typeof input.brandId === "string"
          ? input.brandId
          : typeof (brandContext as Record<string, unknown>).brandId === "string"
            ? ((brandContext as Record<string, unknown>).brandId as string)
            : undefined;
      if (brandId) {
        baseSummary.brand = { id: brandId, name: (brandContext as Record<string, unknown>).brandName as string, slug };
      }
    }

    return this.run<VirtualOfficeMeetingSummary>(
      "virtual-office",
      virtualOfficeMeetingTemplate({ ...input, ...brandContext }),
      baseSummary,
    );
  }

  private async getAgent(brandId: unknown, scopeOrName: string) {
    const agent =
      (await prisma.aIAgentConfig.findFirst({ where: { brandId: brandId as string | undefined, name: scopeOrName } })) ??
      (await prisma.aIAgentConfig.findFirst({ where: { brandId: brandId as string | undefined, osScope: scopeOrName } }));
    return agent ?? (await prisma.aIAgentConfig.findFirst({ where: { name: "default" } }));
  }

  private async getBrandContext(brandId: unknown): Promise<Record<string, unknown>> {
    if (!brandId) return {};
    const id = String(brandId);
    const cached = brandContextCache.get(id);
    if (cached) return cached;

    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { aiConfig: true, identity: true },
    });
    if (!brand) return {};

    const context = {
      brandId: brand.id,
      brandName: brand.name,
      brandSlug: brand.slug,
      aiTone: brand.aiConfig?.aiTone ?? brand.identity?.toneOfVoice,
      aiPersonality: brand.aiConfig?.aiPersonality ?? brand.identity?.persona,
      aiContentStyle: brand.aiConfig?.aiContentStyle,
      aiBlockedTopics: tryParseJson(brand.aiConfig?.aiBlockedTopicsJson),
    };

    brandContextCache.set(id, context);
    return context;
  }

  private async run<T>(ns: string, prompt: string, fallback: T) {
    const key = `${ns}:${hashPayload(prompt)}`;
    const cached = cache.get(key) as T | null;
    if (cached) return { result: cached, cached: true };
    const response = await safeAIRequest(prompt, fallback);
    cache.set(key, response.result);
    return response;
  }

  private buildStandStockFallback(snapshot: StandInventoryContext[]): StandStockSuggestionOutput {
    const threshold = 8;
    const lowStock = snapshot
      .filter((item) => item.quantity <= threshold)
      .map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        currentQty: item.quantity,
        suggestedQty: Math.max(threshold - item.quantity, 1),
        reason: `Fallback: quantity ${item.quantity} <= ${threshold}`,
      }));

    const slowMovers = snapshot
      .filter((item) => item.quantity > threshold && item.quantity < threshold * 2)
      .slice(0, 3)
      .map((item) => ({
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        suggestion: `Fallback: Refresh messaging around ${item.name ?? item.productId}.`,
        campaignIdea: "Bundle with bestseller for limited-time push.",
      }));

    return {
      lowStock,
      slowMovers,
      summary: lowStock.length
        ? "Fallback: Low-stock SKUs identified by threshold."
        : "Fallback: Inventory levels are in a healthy window.",
    };
  }

  private buildSalesPlanFallback(leads: SalesLeadAiContext[]): SalesRepPlanOutput {
    const prioritizedLeads = [...leads]
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 5)
      .map((lead) => ({
        leadId: lead.leadId,
        name: lead.name ?? "Lead",
        stage: lead.stage ?? "Unknown",
        score: lead.score,
        reason: lead.nextAction
          ? `Fallback: ${lead.nextAction}`
          : lead.stage
          ? `Fallback: Stage ${lead.stage} needs attention`
          : "Fallback: Review lead status",
      }));

    const suggestedActions = prioritizedLeads.length
      ? [
          {
            leadId: prioritizedLeads[0].leadId,
            type: "FOLLOW_UP",
            description: `Fallback: Call ${prioritizedLeads[0].name ?? "lead"} to guard the pipeline.`,
          },
          {
            type: "PIPELINE_REVIEW",
            description: "Fallback: Share the prioritization with the team for alignment.",
          },
        ]
      : [
          {
            type: "PIPELINE_REVIEW",
            description: "Fallback: No leads tracked yet; capture updates to get AI guidance.",
          },
        ];

    const emailTemplates = prioritizedLeads.length
      ? [
          {
            leadId: prioritizedLeads[0].leadId,
            subject: `Quick follow-up on your interest`,
            body: `Hi there,\n\nJust circling back on our last conversation. Let me know if you need anything to move forward.\n\nBest,\nMH-OS Team`,
          },
        ]
      : undefined;

    return {
      prioritizedLeads,
      suggestedActions,
      emailTemplates,
      summary: prioritizedLeads.length
        ? "Fallback: Leads are ranked by score and next-action urgency."
        : "Fallback: No leads available yet; log opportunities to enable recommendations.",
    };
  }
}

export const aiOrchestrator = new AiOrchestrator();
