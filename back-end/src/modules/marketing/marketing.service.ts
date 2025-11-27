import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { emitMarketingCreated, emitMarketingDeleted, emitMarketingUpdated } from "./marketing.events.js";
import type { CampaignRecord, CreateMarketingInput, UpdateMarketingInput } from "./marketing.types.js";
import { orchestrateAI, makeCacheKey } from "../../core/ai/aiOrchestrator.js";
import { marketingPrompt, seoPrompt, captionPrompt } from "../../core/ai/promptTemplates.js";

const campaignSelect = {
  id: true,
  brandId: true,
  channelId: true,
  name: true,
  objective: true,
  budget: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CampaignSelect;

class MarketingService {
  constructor(private readonly db = prisma) {}

  async list(params: { brandId?: string; status?: string; page?: number; pageSize?: number } = {}) {
    const { brandId, status, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });
    const where: Prisma.CampaignWhereInput = {};
    if (brandId) where.brandId = brandId;
    if (status) where.status = status;

    const [total, rows] = await this.db.$transaction([
      this.db.campaign.count({ where }),
      this.db.campaign.findMany({ where, select: campaignSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: rows.map((row) => this.map(row)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<CampaignRecord> {
    const campaign = await this.db.campaign.findUnique({ where: { id }, select: campaignSelect });
    if (!campaign) throw notFound("Campaign not found");
    return this.map(campaign);
  }

  async create(input: CreateMarketingInput): Promise<CampaignRecord> {
    if (!input.name) throw badRequest("Name is required");
    const created = await this.db.campaign.create({
      data: {
        brandId: input.brandId ?? null,
        channelId: input.channelId ?? null,
        name: input.name,
        objective: input.objective ?? null,
        budget: input.budget ?? null,
        status: input.status ?? "draft",
      },
      select: campaignSelect,
    });
    await emitMarketingCreated({ id: created.id, brandId: created.brandId ?? undefined }, { brandId: created.brandId ?? undefined, source: "api" });
    return this.map(created);
  }

  async update(id: string, input: UpdateMarketingInput): Promise<CampaignRecord> {
    const existing = await this.db.campaign.findUnique({ where: { id }, select: campaignSelect });
    if (!existing) throw notFound("Campaign not found");

    const updated = await this.db.campaign.update({
      where: { id },
      data: {
        brandId: input.brandId ?? existing.brandId,
        channelId: input.channelId ?? existing.channelId,
        name: input.name ?? existing.name,
        objective: input.objective ?? existing.objective,
        budget: input.budget ?? existing.budget,
        status: input.status ?? existing.status,
      },
      select: campaignSelect,
    });
    await emitMarketingUpdated({ id: updated.id, brandId: updated.brandId ?? undefined }, { brandId: updated.brandId ?? undefined, source: "api" });
    return this.map(updated);
  }

  async remove(id: string) {
    const existing = await this.db.campaign.findUnique({ where: { id }, select: { id: true, brandId: true } });
    if (!existing) throw notFound("Campaign not found");
    await this.db.campaign.delete({ where: { id } });
    await emitMarketingDeleted({ id, brandId: existing.brandId ?? undefined }, { brandId: existing.brandId ?? undefined, source: "api" });
    return { id };
  }

  async logPerformance(campaignId: string, payload: { date: Date; impressions?: number; clicks?: number; spend?: number }) {
    await this.db.marketingPerformanceLog.create({
      data: {
        campaignId,
        date: payload.date,
        impressions: payload.impressions ?? null,
        clicks: payload.clicks ?? null,
        spend: payload.spend ?? null,
      },
    });
  }

  private map(row: Prisma.CampaignGetPayload<{ select: typeof campaignSelect }>): CampaignRecord {
    return {
      id: row.id,
      brandId: row.brandId ?? undefined,
      channelId: row.channelId ?? undefined,
      name: row.name,
      objective: row.objective ?? undefined,
      budget: row.budget ? Number(row.budget) : null,
      status: row.status ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const marketingService = new MarketingService();

export const marketingAIService = {
  async generate(payload: { goal: string; tone?: string; audience?: string }) {
    const prompt = marketingPrompt(payload);
    const cacheKey = makeCacheKey("marketing-generate", payload);
    const response = await orchestrateAI({
      key: cacheKey,
      prompt,
      fallback: () => ({
        headline: payload.goal,
        body: "Draft copy based on goal.",
        cta: "Learn more",
        keywords: [payload.goal],
        tone: payload.tone ?? "friendly",
      }),
    });
    return response.result;
  },
  async seo(payload: { topic: string; locale?: string }) {
    const prompt = seoPrompt(payload);
    const cacheKey = makeCacheKey("marketing-seo", payload);
    const response = await orchestrateAI({
      key: cacheKey,
      prompt,
      fallback: () => ({
        title: payload.topic,
        keywords: [payload.topic, "seo"],
        description: `SEO ideas for ${payload.topic}`,
      }),
    });
    return response.result;
  },
  async captions(payload: { topic: string; platform?: string; tone?: string }) {
    const prompt = captionPrompt(payload);
    const cacheKey = makeCacheKey("marketing-captions", payload);
    const response = await orchestrateAI({
      key: cacheKey,
      prompt,
      fallback: () => ({
        captions: [`${payload.topic} rocks!`, `Learn more about ${payload.topic}`],
      }),
    });
    return response.result;
  },
};
