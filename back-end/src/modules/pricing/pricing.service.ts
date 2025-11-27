import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { orchestrateAI, makeCacheKey } from "../../core/ai/aiOrchestrator.js";
import { pricingSuggestionPrompt } from "../../core/ai/promptTemplates.js";
import {
  emitCompetitorPriceRecorded,
  emitPricingCreated,
  emitPricingDeleted,
  emitPricingDraftCreated,
  emitPricingLogRecorded,
  emitPricingUpdated,
} from "./pricing.events.js";
import type {
  CompetitorPriceInput,
  CompetitorPriceRecord,
  CreateDraftInput,
  CreatePricingInput,
  ListPricingParams,
  PaginatedPricing,
  PricingAISuggestion,
  PricingDraftRecord,
  PricingLogRecord,
  PricingRecord,
  UpdatePricingInput,
} from "./pricing.types.js";

const pricingSelect = {
  id: true,
  productId: true,
  brandId: true,
  cogsEur: true,
  fullCostEur: true,
  b2cNet: true,
  b2cGross: true,
  dealerNet: true,
  dealerPlusNet: true,
  standPartnerNet: true,
  distributorNet: true,
  amazonNet: true,
  uvpNet: true,
  vatPct: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductPricingSelect;

const draftSelect = {
  id: true,
  productId: true,
  brandId: true,
  channel: true,
  oldNet: true,
  newNet: true,
  status: true,
  createdById: true,
  approvedById: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductPriceDraftSelect;

const competitorSelect = {
  id: true,
  productId: true,
  brandId: true,
  competitor: true,
  marketplace: true,
  country: true,
  priceNet: true,
  priceGross: true,
  currency: true,
  collectedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CompetitorPriceSelect;

const logSelect = {
  id: true,
  productId: true,
  brandId: true,
  channel: true,
  oldNet: true,
  newNet: true,
  aiAgent: true,
  confidenceScore: true,
  summary: true,
  createdAt: true,
} satisfies Prisma.AIPricingHistorySelect;

class PricingService {
  constructor(private readonly db = prisma) {}

  async list(params: ListPricingParams = {}): Promise<PaginatedPricing> {
    const { productId, brandId, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });

    const where: Prisma.ProductPricingWhereInput = {};
    if (productId) where.productId = productId;
    if (brandId) where.brandId = brandId;

    const [total, records] = await this.db.$transaction([
      this.db.productPricing.count({ where }),
      this.db.productPricing.findMany({
        where,
        select: pricingSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data: records.map((record) => this.mapPricing(record)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<PricingRecord> {
    const record = await this.db.productPricing.findUnique({ where: { id }, select: pricingSelect });
    if (!record) {
      throw notFound("Pricing not found");
    }
    return this.mapPricing(record);
  }

  async create(input: CreatePricingInput): Promise<PricingRecord> {
    await this.ensureProductExists(input.productId);
    if (input.brandId) {
      await this.ensureBrandExists(input.brandId);
    }

    const existing = await this.db.productPricing.findUnique({ where: { productId: input.productId } });
    if (existing) {
      throw badRequest("Pricing already exists for this product");
    }

    const created = await this.db.productPricing.create({
      data: this.normalizePricingInput(input),
      select: pricingSelect,
    });

    await emitPricingCreated(
      { id: created.id, productId: created.productId, brandId: created.brandId ?? undefined },
      { brandId: created.brandId ?? undefined, source: "api" },
    );
    await this.recordHistory(
      created.productId,
      created.brandId ?? undefined,
      "base",
      null,
      this.decimalToNumber(created.b2cNet),
      "Pricing created",
    );
    return this.mapPricing(created);
  }

  async update(id: string, input: UpdatePricingInput): Promise<PricingRecord> {
    const existing = await this.db.productPricing.findUnique({ where: { id }, select: pricingSelect });
    if (!existing) {
      throw notFound("Pricing not found");
    }

    if (input.productId && input.productId !== existing.productId) {
      await this.ensureProductExists(input.productId);
      const collision = await this.db.productPricing.findUnique({ where: { productId: input.productId } });
      if (collision) {
        throw badRequest("Pricing already exists for the target product");
      }
    }

    if (input.brandId && input.brandId !== (existing.brandId ?? undefined)) {
      await this.ensureBrandExists(input.brandId);
    }

    const updated = await this.db.productPricing.update({
      where: { id },
      data: this.normalizePricingInput({ ...input, productId: input.productId ?? existing.productId }),
      select: pricingSelect,
    });

    await emitPricingUpdated(
      { id: updated.id, productId: updated.productId, brandId: updated.brandId ?? undefined },
      { brandId: updated.brandId ?? undefined, source: "api" },
    );
    await this.recordHistory(
      updated.productId,
      updated.brandId ?? undefined,
      "base",
      this.decimalToNumber(existing.b2cNet),
      this.decimalToNumber(updated.b2cNet),
      "Pricing updated",
    );
    return this.mapPricing(updated);
  }

  async remove(id: string) {
    const existing = await this.db.productPricing.findUnique({ where: { id }, select: { id: true, productId: true, brandId: true } });
    if (!existing) {
      throw notFound("Pricing not found");
    }

    await this.db.productPricing.delete({ where: { id } });
    await emitPricingDeleted(
      { id, productId: existing.productId, brandId: existing.brandId ?? undefined },
      { brandId: existing.brandId ?? undefined, source: "api" },
    );
    return { id };
  }

  async createDraft(productId: string, input: CreateDraftInput): Promise<PricingDraftRecord> {
    const product = await this.ensureProductExists(productId);
    if (input.brandId) {
      await this.ensureBrandExists(input.brandId);
    }

    const draft = await this.db.productPriceDraft.create({
      data: {
        productId,
        brandId: input.brandId ?? product.brandId ?? undefined,
        channel: input.channel,
        oldNet: input.oldNet ?? null,
        newNet: input.newNet ?? null,
        status: input.status ?? "DRAFT",
        createdById: input.createdById,
        approvedById: input.approvedById,
      },
      select: draftSelect,
    });

    await emitPricingDraftCreated(
      { id: draft.id, productId: draft.productId, brandId: draft.brandId ?? undefined },
      { brandId: draft.brandId ?? undefined, source: "api" },
    );
    return this.mapDraft(draft);
  }

  async listDrafts(productId: string): Promise<PricingDraftRecord[]> {
    await this.ensureProductExists(productId);
    const drafts = await this.db.productPriceDraft.findMany({
      where: { productId },
      select: draftSelect,
      orderBy: { createdAt: "desc" },
    });
    return drafts.map((draft) => this.mapDraft(draft));
  }

  async addCompetitorPrice(productId: string, input: CompetitorPriceInput): Promise<CompetitorPriceRecord> {
    const product = await this.ensureProductExists(productId);
    if (input.brandId) {
      await this.ensureBrandExists(input.brandId);
    }

    const competitorPrice = await this.db.competitorPrice.create({
      data: {
        productId,
        brandId: input.brandId ?? product.brandId ?? undefined,
        competitor: input.competitor,
        marketplace: input.marketplace,
        country: input.country,
        priceNet: input.priceNet ?? null,
        priceGross: input.priceGross ?? null,
        currency: input.currency,
        collectedAt: input.collectedAt ?? new Date(),
      },
      select: competitorSelect,
    });

    await emitCompetitorPriceRecorded({
      id: competitorPrice.id,
      productId: competitorPrice.productId,
      brandId: competitorPrice.brandId ?? undefined,
    });
    return this.mapCompetitorPrice(competitorPrice);
  }

  async listCompetitorPrices(productId: string): Promise<CompetitorPriceRecord[]> {
    await this.ensureProductExists(productId);
    const competitors = await this.db.competitorPrice.findMany({
      where: { productId },
      select: competitorSelect,
      orderBy: { collectedAt: "desc" },
    });
    return competitors.map((record) => this.mapCompetitorPrice(record));
  }

  async listLogs(productId: string): Promise<PricingLogRecord[]> {
    await this.ensureProductExists(productId);
    const logs = await this.db.aIPricingHistory.findMany({
      where: { productId },
      select: logSelect,
      orderBy: { createdAt: "desc" },
    });
    return logs.map((log) => ({
      id: log.id,
      productId: log.productId,
      brandId: log.brandId ?? undefined,
      channel: log.channel ?? undefined,
      oldNet: this.decimalToNumber(log.oldNet),
      newNet: this.decimalToNumber(log.newNet),
      aiAgent: log.aiAgent ?? undefined,
      confidenceScore: this.decimalToNumber(log.confidenceScore),
      summary: log.summary ?? undefined,
      createdAt: log.createdAt,
    }));
  }

  private normalizePricingInput(input: CreatePricingInput | UpdatePricingInput): Prisma.ProductPricingUncheckedCreateInput {
    return {
      productId: input.productId ?? "",
      brandId: input.brandId,
      cogsEur: input.cogsEur ?? null,
      fullCostEur: input.fullCostEur ?? null,
      b2cNet: input.b2cNet ?? null,
      b2cGross: input.b2cGross ?? null,
      dealerNet: input.dealerNet ?? null,
      dealerPlusNet: input.dealerPlusNet ?? null,
      standPartnerNet: input.standPartnerNet ?? null,
      distributorNet: input.distributorNet ?? null,
      amazonNet: input.amazonNet ?? null,
      uvpNet: input.uvpNet ?? null,
      vatPct: input.vatPct ?? null,
    };
  }

  private mapPricing(record: Prisma.ProductPricingGetPayload<{ select: typeof pricingSelect }>): PricingRecord {
    return {
      id: record.id,
      productId: record.productId,
      brandId: record.brandId ?? undefined,
      cogsEur: this.decimalToNumber(record.cogsEur),
      fullCostEur: this.decimalToNumber(record.fullCostEur),
      b2cNet: this.decimalToNumber(record.b2cNet),
      b2cGross: this.decimalToNumber(record.b2cGross),
      dealerNet: this.decimalToNumber(record.dealerNet),
      dealerPlusNet: this.decimalToNumber(record.dealerPlusNet),
      standPartnerNet: this.decimalToNumber(record.standPartnerNet),
      distributorNet: this.decimalToNumber(record.distributorNet),
      amazonNet: this.decimalToNumber(record.amazonNet),
      uvpNet: this.decimalToNumber(record.uvpNet),
      vatPct: this.decimalToNumber(record.vatPct),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private mapDraft(record: Prisma.ProductPriceDraftGetPayload<{ select: typeof draftSelect }>): PricingDraftRecord {
    return {
      id: record.id,
      productId: record.productId,
      brandId: record.brandId ?? undefined,
      channel: record.channel,
      oldNet: this.decimalToNumber(record.oldNet),
      newNet: this.decimalToNumber(record.newNet),
      status: record.status ?? undefined,
      createdById: record.createdById ?? undefined,
      approvedById: record.approvedById ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private mapCompetitorPrice(
    record: Prisma.CompetitorPriceGetPayload<{ select: typeof competitorSelect }>,
  ): CompetitorPriceRecord {
    return {
      id: record.id,
      productId: record.productId,
      brandId: record.brandId ?? undefined,
      competitor: record.competitor,
      marketplace: record.marketplace ?? undefined,
      country: record.country ?? undefined,
      priceNet: this.decimalToNumber(record.priceNet),
      priceGross: this.decimalToNumber(record.priceGross),
      currency: record.currency ?? undefined,
      collectedAt: record.collectedAt ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private decimalToNumber(value?: Prisma.Decimal | null) {
    if (value === null || value === undefined) return null;
    return Number(value);
  }

  private async ensureProductExists(productId: string) {
    const product = await this.db.brandProduct.findUnique({ where: { id: productId }, select: { id: true, brandId: true } });
    if (!product) {
      throw badRequest("Product not found");
    }
    return product;
  }

  private async ensureBrandExists(brandId: string) {
    const brand = await this.db.brand.findUnique({ where: { id: brandId }, select: { id: true } });
    if (!brand) {
      throw badRequest("Brand not found");
    }
  }

  private async recordHistory(
    productId: string,
    brandId: string | undefined,
    channel: string | null,
    oldNet: number | null,
    newNet: number | null,
    summary: string,
  ) {
    const log = await this.db.aIPricingHistory.create({
      data: {
        productId,
        brandId,
        channel,
        oldNet,
        newNet,
        summary,
      },
      select: logSelect,
    });
    await emitPricingLogRecorded(
      { id: log.id, productId: log.productId, brandId: log.brandId ?? undefined },
      { brandId: log.brandId ?? undefined, source: "api" },
    );
  }

  async generateAISuggestion(productId: string): Promise<PricingAISuggestion> {
    const product = await this.db.brandProduct.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        brand: { select: { id: true, name: true } },
        pricing: { select: pricingSelect },
        competitorPrices: { select: { priceNet: true, competitor: true, collectedAt: true }, orderBy: { collectedAt: "desc" }, take: 5 },
      },
    });
    if (!product) throw badRequest("Product not found");

    const competitorSummary = product.competitorPrices
      .map((c) => `${c.competitor}: ${c.priceNet ?? "n/a"}`)
      .join("; ");

    const prompt = pricingSuggestionPrompt({
      productName: product.name,
      brandName: product.brand?.name,
      competitorSummary: competitorSummary || "none",
      currentNet: this.decimalToNumber(product.pricing?.b2cNet),
      vatPct: this.decimalToNumber(product.pricing?.vatPct),
      marginHint: "Maintain margin >= 20%",
    });

    const cacheKey = makeCacheKey("pricing-ai", { productId, competitorSummary, net: product.pricing?.b2cNet });

    const response = await orchestrateAI<PricingAISuggestion>({
      key: cacheKey,
      prompt,
      fallback: () => ({
        suggestedPrice: this.decimalToNumber(product.pricing?.b2cNet) ?? null,
        reasoning: "Used latest known net price as fallback.",
        riskLevel: "MEDIUM",
        competitorSummary: competitorSummary || "No competitor data",
        confidenceScore: 0.4,
      }),
    });

    return response.result;
  }
}

export const pricingService = new PricingService();
