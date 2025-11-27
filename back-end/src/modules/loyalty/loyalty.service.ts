import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { emitLoyaltyCreated } from "./loyalty.events.js";
import type { CreateLoyaltyInput, LoyaltyCustomerRecord, UpdateLoyaltyInput } from "./loyalty.types.js";

const customerSelect = {
  id: true,
  brandId: true,
  programId: true,
  userId: true,
  personId: true,
  pointsBalance: true,
  tier: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.LoyaltyCustomerSelect;

class LoyaltyService {
  constructor(private readonly db = prisma) {}

  async list(params: { brandId?: string; programId?: string; page?: number; pageSize?: number } = {}) {
    const { brandId, programId, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });
    const where: Prisma.LoyaltyCustomerWhereInput = {};
    if (brandId) where.brandId = brandId;
    if (programId) where.programId = programId;

    const [total, rows] = await this.db.$transaction([
      this.db.loyaltyCustomer.count({ where }),
      this.db.loyaltyCustomer.findMany({ where, select: customerSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: rows.map((row) => this.map(row)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<LoyaltyCustomerRecord> {
    const record = await this.db.loyaltyCustomer.findUnique({ where: { id }, select: customerSelect });
    if (!record) throw notFound("Loyalty customer not found");
    return this.map(record);
  }

  async create(input: CreateLoyaltyInput): Promise<LoyaltyCustomerRecord> {
    if (!input.programId) throw badRequest("programId is required");
    const created = await this.db.loyaltyCustomer.create({
      data: {
        brandId: input.brandId ?? null,
        programId: input.programId,
        userId: input.userId ?? null,
        personId: input.personId ?? null,
        pointsBalance: input.pointsBalance ?? 0,
        tier: input.tier ?? null,
      },
      select: customerSelect,
    });
    await emitLoyaltyCreated(
      { id: created.id, brandId: created.brandId ?? undefined, programId: created.programId },
      { brandId: created.brandId ?? undefined, source: "api" },
    );
    return this.map(created);
  }

  async update(id: string, input: UpdateLoyaltyInput): Promise<LoyaltyCustomerRecord> {
    const existing = await this.db.loyaltyCustomer.findUnique({ where: { id }, select: customerSelect });
    if (!existing) throw notFound("Loyalty customer not found");

    const updated = await this.db.loyaltyCustomer.update({
      where: { id },
      data: {
        brandId: input.brandId ?? existing.brandId,
        programId: input.programId ?? existing.programId,
        userId: input.userId ?? existing.userId,
        personId: input.personId ?? existing.personId,
        tier: input.tier ?? existing.tier,
        pointsBalance: input.pointsBalance ?? existing.pointsBalance,
      },
      select: customerSelect,
    });

    if (input.pointsDelta && input.pointsDelta !== 0) {
      await this.adjustPoints(updated.id, input.pointsDelta, input.reason ?? "adjustment");
    }

    return this.map(updated);
  }

  async adjustPoints(customerId: string, delta: number, reason: string) {
    const customer = await this.db.loyaltyCustomer.findUnique({ where: { id: customerId }, select: customerSelect });
    if (!customer) throw notFound("Loyalty customer not found");

    const nextBalance = customer.pointsBalance + delta;
    await this.db.$transaction([
      this.db.loyaltyCustomer.update({ where: { id: customerId }, data: { pointsBalance: nextBalance } }),
      this.db.loyaltyTransaction.create({
        data: {
          brandId: customer.brandId,
          customerId,
          programId: customer.programId,
          pointsChange: delta,
          reason,
        },
      }),
    ]);
  }

  async remove(id: string) {
    await this.db.loyaltyCustomer.delete({ where: { id } });
    return { id };
  }

  private map(row: Prisma.LoyaltyCustomerGetPayload<{ select: typeof customerSelect }>): LoyaltyCustomerRecord {
    return {
      id: row.id,
      brandId: row.brandId ?? undefined,
      programId: row.programId,
      userId: row.userId ?? undefined,
      personId: row.personId ?? undefined,
      pointsBalance: row.pointsBalance,
      tier: row.tier ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const loyaltyService = new LoyaltyService();
