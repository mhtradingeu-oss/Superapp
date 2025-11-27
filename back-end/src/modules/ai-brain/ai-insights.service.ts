import { prisma } from "../../core/prisma.js";
import { aiOrchestrator } from "../../core/ai/orchestrator.js";
import { notFound } from "../../core/http/errors.js";
import { aiKpiService } from "./ai-kpi.service.js";
import type { KPIOverviewPayload } from "./ai-brain.types.js";

function formatInsightDetails(scope: string, payload: unknown) {
  if (!payload) return `${scope} insight generated with no details.`;
  if (typeof payload === "string") return payload;
  try {
    return `**${scope.toUpperCase()} Insight**\n\n\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``;
  } catch {
    return `${scope} insight generated.`;
  }
}

export const aiInsightsService = {
  async refresh(payload: { brandId?: string; scope?: string }) {
    const baseData = {
      brandId: payload.brandId,
      summary: "Insight generated",
      details: "",
    };

    const pricing = await aiOrchestrator.generatePricingInsight({ brandId: payload.brandId, scope: payload.scope });
    const crm = await aiOrchestrator.generateCRMInsight({ brandId: payload.brandId, scope: payload.scope });
    const marketing = await aiOrchestrator.generateMarketingInsight({ brandId: payload.brandId, scope: payload.scope });
    const inventory = await aiOrchestrator.generateInventoryInsight({ brandId: payload.brandId, scope: payload.scope });
    const loyalty = await aiOrchestrator.generateLoyaltyInsight({ brandId: payload.brandId, scope: payload.scope });

    const insights = [
      {
        ...baseData,
        os: "pricing",
        summary: (pricing as any).summary ?? "Pricing insight",
        details: formatInsightDetails("pricing", pricing),
      },
      { ...baseData, os: "crm", summary: (crm as any).summary ?? "CRM insight", details: formatInsightDetails("crm", crm) },
      {
        ...baseData,
        os: "marketing",
        summary: (marketing as any).summary ?? "Marketing insight",
        details: formatInsightDetails("marketing", marketing),
      },
      {
        ...baseData,
        os: "inventory",
        summary: (inventory as any).summary ?? "Inventory insight",
        details: formatInsightDetails("inventory", inventory),
      },
      {
        ...baseData,
        os: "loyalty",
        summary: (loyalty as any).summary ?? "Loyalty insight",
        details: formatInsightDetails("loyalty", loyalty),
      },
    ];

    return prisma.$transaction(insights.map((insight) => prisma.aIInsight.create({ data: insight })));
  },
  async list(filters: { brandId?: string; scope?: string; limit?: number; periodStart?: Date; periodEnd?: Date; sortOrder?: "asc" | "desc" }) {
    return prisma.aIInsight.findMany({
      where: { brandId: filters.brandId, os: filters.scope, createdAt: { gte: filters.periodStart, lte: filters.periodEnd } },
      orderBy: { createdAt: filters.sortOrder ?? "desc" },
      take: filters.limit ?? 50,
    });
  },
  async get(id: string) {
    const record = await prisma.aIInsight.findUnique({ where: { id } });
    if (!record) throw notFound("Insight not found");
    return record;
  },
  async createReport(payload: { brandId?: string; title: string; scope?: string; periodStart?: Date; periodEnd?: Date }) {
    const report = await aiOrchestrator.generateFullBrandReport({ brandId: payload.brandId, scope: payload.scope });
    return prisma.aIReport.create({
      data: {
        brandId: payload.brandId,
        title: payload.title,
        scope: payload.scope,
        periodStart: payload.periodStart,
        periodEnd: payload.periodEnd,
        content: JSON.stringify(report.result ?? report),
      },
    });
  },
  async listReports(filters: { brandId?: string; scope?: string; periodStart?: Date; periodEnd?: Date }) {
    return prisma.aIReport.findMany({
      where: { brandId: filters.brandId, scope: filters.scope, createdAt: { gte: filters.periodStart, lte: filters.periodEnd } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  },
  async getReport(id: string) {
    const report = await prisma.aIReport.findUnique({ where: { id } });
    if (!report) throw notFound("Report not found");
    return report;
  },

  renderReport(report: { id: string; title: string; scope: string | null; brandId: string | null; content: string | null; createdAt: Date; periodStart: Date | null; periodEnd: Date | null }) {
    const contentMarkdown = report.content ?? "";
    const contentHtmlSafe = contentMarkdown ? contentMarkdown.replace(/\n/g, "<br/>") : null;
    return {
      id: report.id,
      title: report.title,
      brandId: report.brandId,
      scope: report.scope,
      periodStart: report.periodStart,
      periodEnd: report.periodEnd,
      createdAt: report.createdAt,
      contentMarkdown,
      contentHtmlSafe,
    };
  },

  async getReportRendered(id: string) {
    const report = await this.getReport(id);
    return this.renderReport(report);
  },

  async kpiSummary(filters: { brandId?: string; scope?: string; periodStart?: Date; periodEnd?: Date }): Promise<KPIOverviewPayload> {
    return aiKpiService.getOverview(filters);
  },
};
