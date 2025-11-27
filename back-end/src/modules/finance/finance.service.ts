import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { emitFinanceCreated, emitFinanceDeleted, emitFinanceUpdated } from "./finance.events.js";
import type { CreateFinanceInput, FinanceRecord, UpdateFinanceInput } from "./finance.types.js";

const revenueSelect = {
  id: true,
  brandId: true,
  productId: true,
  channel: true,
  amount: true,
  currency: true,
  periodStart: true,
  periodEnd: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RevenueRecordSelect;

class FinanceService {
  constructor(private readonly db = prisma) {}

  async list(params: { brandId?: string; productId?: string; page?: number; pageSize?: number } = {}) {
    const { brandId, productId, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });
    const where: Prisma.RevenueRecordWhereInput = {};
    if (brandId) where.brandId = brandId;
    if (productId) where.productId = productId;

    const [total, rows] = await this.db.$transaction([
      this.db.revenueRecord.count({ where }),
      this.db.revenueRecord.findMany({ where, select: revenueSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: rows.map((row) => this.map(row)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<FinanceRecord> {
    const record = await this.db.revenueRecord.findUnique({ where: { id }, select: revenueSelect });
    if (!record) throw notFound("Finance record not found");
    return this.map(record);
  }

  async create(input: CreateFinanceInput): Promise<FinanceRecord> {
    if (input.amount === undefined || input.amount === null) {
      throw badRequest("amount is required");
    }
    const created = await this.db.revenueRecord.create({
      data: {
        brandId: input.brandId ?? null,
        productId: input.productId ?? null,
        channel: input.channel ?? null,
        amount: input.amount,
        currency: input.currency ?? "EUR",
        periodStart: input.periodStart ? new Date(input.periodStart) : null,
        periodEnd: input.periodEnd ? new Date(input.periodEnd) : null,
      },
      select: revenueSelect,
    });
    await emitFinanceCreated({ id: created.id, brandId: created.brandId ?? undefined }, { brandId: created.brandId ?? undefined, source: "api" });
    return this.map(created);
  }

  async update(id: string, input: UpdateFinanceInput): Promise<FinanceRecord> {
    const existing = await this.db.revenueRecord.findUnique({ where: { id }, select: revenueSelect });
    if (!existing) throw notFound("Finance record not found");

    const updated = await this.db.revenueRecord.update({
      where: { id },
      data: {
        brandId: input.brandId ?? existing.brandId,
        productId: input.productId ?? existing.productId,
        channel: input.channel ?? existing.channel,
        amount: input.amount ?? existing.amount,
        currency: input.currency ?? existing.currency,
        periodStart: input.periodStart ? new Date(input.periodStart) : existing.periodStart,
        periodEnd: input.periodEnd ? new Date(input.periodEnd) : existing.periodEnd,
      },
      select: revenueSelect,
    });
    await emitFinanceUpdated({ id: updated.id, brandId: updated.brandId ?? undefined }, { brandId: updated.brandId ?? undefined, source: "api" });
    return this.map(updated);
  }

  async remove(id: string) {
    const record = await this.db.revenueRecord.findUnique({ where: { id }, select: { id: true, brandId: true } });
    if (!record) throw notFound("Finance record not found");
    await this.db.revenueRecord.delete({ where: { id } });
    await emitFinanceDeleted({ id, brandId: record.brandId ?? undefined }, { brandId: record.brandId ?? undefined, source: "api" });
    return { id };
  }

  private map(row: Prisma.RevenueRecordGetPayload<{ select: typeof revenueSelect }>): FinanceRecord {
    return {
      id: row.id,
      brandId: row.brandId ?? undefined,
      productId: row.productId ?? undefined,
      channel: row.channel ?? undefined,
      amount: row.amount ? Number(row.amount) : null,
      currency: row.currency ?? undefined,
      periodStart: row.periodStart ?? undefined,
      periodEnd: row.periodEnd ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const financeService = new FinanceService();
