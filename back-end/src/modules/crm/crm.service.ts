import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { emitCrmCreated, emitCrmDeleted, emitCrmUpdated } from "./crm.events.js";
import type { CreateLeadInput, LeadRecord, UpdateLeadInput } from "./crm.types.js";
import { orchestrateAI, makeCacheKey } from "../../core/ai/aiOrchestrator.js";
import { crmScorePrompt } from "../../core/ai/promptTemplates.js";

const leadSelect = {
  id: true,
  brandId: true,
  status: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
  person: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
} satisfies Prisma.LeadSelect;

class CrmService {
  constructor(private readonly db = prisma) {}

  async list(params: { brandId?: string; status?: string; search?: string; page?: number; pageSize?: number } = {}) {
    const { brandId, status, search, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });

    const where: Prisma.LeadWhereInput = {};
    if (brandId) where.brandId = brandId;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { person: { firstName: { contains: search, mode: "insensitive" } } },
        { person: { lastName: { contains: search, mode: "insensitive" } } },
        { person: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    const [total, rows] = await this.db.$transaction([
      this.db.lead.count({ where }),
      this.db.lead.findMany({ where, select: leadSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: rows.map((row) => this.mapLead(row)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<LeadRecord> {
    const lead = await this.db.lead.findUnique({ where: { id }, select: leadSelect });
    if (!lead) throw notFound("Lead not found");
    return this.mapLead(lead);
  }

  async create(input: CreateLeadInput): Promise<LeadRecord> {
    const personId = await this.ensurePerson(input);
    const created = await this.db.lead.create({
      data: {
        brandId: input.brandId ?? null,
        personId,
        status: input.status ?? "new",
        ownerId: input.ownerId ?? null,
        sourceId: input.sourceId ?? null,
      },
      select: leadSelect,
    });
    await emitCrmCreated({ id: created.id, brandId: created.brandId ?? undefined, status: created.status }, { brandId: created.brandId ?? undefined, source: "api" });
    return this.mapLead(created);
  }

  async update(id: string, input: UpdateLeadInput): Promise<LeadRecord> {
    const existing = await this.db.lead.findUnique({ where: { id }, select: leadSelect });
    if (!existing) throw notFound("Lead not found");

    const personId = input.email || input.name || input.phone ? await this.ensurePerson(input, existing.brandId ?? undefined) : undefined;

    const updated = await this.db.lead.update({
      where: { id },
      data: {
        brandId: input.brandId ?? existing.brandId,
        status: input.status ?? existing.status,
        ownerId: input.ownerId ?? existing.ownerId,
        sourceId: input.sourceId ?? undefined,
        personId: personId ?? existing.person?.id ?? undefined,
      },
      select: leadSelect,
    });
    await emitCrmUpdated({ id: updated.id, brandId: updated.brandId ?? undefined, status: updated.status }, { brandId: updated.brandId ?? undefined, source: "api" });
    return this.mapLead(updated);
  }

  async remove(id: string) {
    const lead = await this.db.lead.findUnique({ where: { id }, select: { id: true, brandId: true } });
    if (!lead) throw notFound("Lead not found");
    await this.db.lead.delete({ where: { id } });
    await emitCrmDeleted({ id: lead.id, brandId: lead.brandId ?? undefined }, { brandId: lead.brandId ?? undefined, source: "api" });
    return { id };
  }

  private async ensurePerson(input: CreateLeadInput, brandId?: string) {
    if (!input.email && !input.name && !input.phone) {
      throw badRequest("Lead requires at least a name or email");
    }
    if (input.email) {
      const existing = await this.db.person.findUnique({ where: { email: input.email }, select: { id: true } });
      if (existing) return existing.id;
    }
    const [firstName, ...rest] = (input.name ?? "").split(" ");
    const lastName = rest.join(" ") || undefined;
    const person = await this.db.person.create({
      data: {
        brandId: input.brandId ?? brandId ?? null,
        firstName: firstName || null,
        lastName: lastName ?? null,
        email: input.email ?? null,
        phone: input.phone ?? null,
      },
    });
    return person.id;
  }

  private mapLead(row: Prisma.LeadGetPayload<{ select: typeof leadSelect }>): LeadRecord {
    const fullName = [row.person?.firstName, row.person?.lastName].filter(Boolean).join(" ").trim();
    return {
      id: row.id,
      brandId: row.brandId ?? undefined,
      status: row.status ?? undefined,
      ownerId: row.ownerId ?? undefined,
      name: fullName || undefined,
      email: row.person?.email ?? undefined,
      phone: row.person?.phone ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
}

export const crmService = new CrmService();

export const crmServiceAI = {
  async scoreLead(payload: { leadName: string; intent?: string }) {
    const prompt = crmScorePrompt({ leadName: payload.leadName, intent: payload.intent, scoreFactors: "recent activity and fit" });
    const cacheKey = makeCacheKey("crm-ai", payload);
    const result = await orchestrateAI({
      key: cacheKey,
      prompt,
      fallback: () => ({
        score: 55,
        probability: 0.4,
        reasons: ["Fallback score", "No AI response"],
        nextAction: "Follow up manually",
      }),
    });
    return result.result;
  },
};
