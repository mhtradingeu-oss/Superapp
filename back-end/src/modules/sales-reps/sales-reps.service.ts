import { Prisma } from "@prisma/client";
import { aiOrchestrator } from "../../core/ai/orchestrator.js";
import { prisma } from "../../core/prisma.js";
import { publish } from "../../core/events/event-bus.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { notFound } from "../../core/http/errors.js";
import type {
  SalesKpiSummary,
  SalesLeadInput,
  SalesLeadListFilters,
  SalesVisitInput,
  SalesVisitListFilters,
  SalesVisitListResult,
  SalesVisitRecord,
  SalesLeadListResult,
  SalesLeadRecord,
  SalesRepCreateInput,
  SalesRepListFilters,
  SalesRepListResult,
  SalesRepListItem,
  SalesRepUpdateInput,
  SalesRepAiPlanRequest,
  SalesRepAiPlanDto,
} from "./sales-reps.types.js";

class SalesRepsService {
  constructor(private readonly db = prisma) {}

  async list(filters: SalesRepListFilters): Promise<SalesRepListResult> {
    const { skip, take } = buildPagination(filters);
    const where: Prisma.SalesRepWhereInput = {};
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.region) where.region = filters.region;
    if (filters.status) where.status = filters.status;

    const [total, reps] = await this.db.$transaction([
      this.db.salesRep.count({ where }),
      this.db.salesRep.findMany({
        where,
        include: {
          territories: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    const data: SalesRepListItem[] = reps.map((rep) => ({
      id: rep.id,
      brandId: rep.brandId ?? undefined,
      userId: rep.userId ?? undefined,
      code: rep.code ?? undefined,
      region: rep.region ?? undefined,
      status: rep.status ?? undefined,
      territoryCount: rep.territories.length,
    }));

    return {
      data,
      total,
      page: filters.page ?? 1,
      pageSize: take,
    };
  }

  async getById(id: string) {
    const rep = await this.db.salesRep.findUnique({
      where: { id },
      include: {
        territories: { include: { territory: true } },
        leads: true,
        visits: true,
        quotes: true,
        orders: true,
      },
    });
    if (!rep) {
      throw notFound("Sales rep not found");
    }
    return rep;
  }

  async create(input: SalesRepCreateInput) {
    const rep = await this.db.salesRep.create({
      data: {
        brandId: input.brandId ?? null,
        userId: input.userId ?? null,
        code: input.code,
        region: input.region,
        status: input.status ?? "ACTIVE",
      },
    });
    await publish("sales-reps.rep.created", { repId: rep.id }, { module: "sales-reps" });
    return rep;
  }

  async update(id: string, input: SalesRepUpdateInput) {
    const rep = await this.db.salesRep.update({
      where: { id },
      data: {
        brandId: input.brandId ?? undefined,
        userId: input.userId ?? undefined,
        code: input.code ?? undefined,
        region: input.region ?? undefined,
        status: input.status ?? undefined,
      },
    });
    await publish("sales-reps.rep.updated", { repId: rep.id }, { module: "sales-reps" });
    return rep;
  }

  async listLeads(repId: string, filters: SalesLeadListFilters): Promise<SalesLeadListResult> {
    await this.ensureRepExists(repId);
    const { skip, take } = buildPagination(filters);
    const where: Prisma.SalesLeadWhereInput = { repId };
    if (filters.status) where.status = filters.status;

    const [total, leads] = await this.db.$transaction([
      this.db.salesLead.count({ where }),
      this.db.salesLead.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    const data: SalesLeadRecord[] = leads.map((lead) => ({
      id: lead.id,
      repId: lead.repId,
      stage: lead.stage ?? undefined,
      status: lead.status,
      source: lead.source ?? undefined,
      score: lead.score ? Number(lead.score) : undefined,
      nextAction: lead.nextAction ?? undefined,
      createdAt: lead.createdAt,
    }));

    return {
      data,
      total,
      page: filters.page ?? 1,
      pageSize: take,
    };
  }

  async createLead(repId: string, input: SalesLeadInput): Promise<SalesLeadRecord> {
    const rep = await this.db.salesRep.findUnique({ where: { id: repId } });
    if (!rep) {
      throw notFound("Sales rep not found");
    }

    const lead = await this.db.salesLead.create({
      data: {
        repId,
        brandId: rep.brandId ?? null,
        leadId: input.leadId ?? null,
        companyId: input.companyId ?? null,
        territoryId: input.territoryId ?? null,
        source: input.source,
        score: input.score ? new Prisma.Decimal(input.score) : undefined,
        stage: input.stage,
        status: input.status ?? "OPEN",
        nextAction: input.nextAction,
        notes: input.notes,
      },
    });

    await publish(
      "sales-reps.lead.created",
      { repId, leadId: lead.id },
      { module: "sales-reps" },
    );
    // TODO: Trigger AI scoring and follow-up recommendations via the AI Brain.

    return {
      id: lead.id,
      repId: lead.repId,
      stage: lead.stage ?? undefined,
      status: lead.status,
      source: lead.source ?? undefined,
      score: lead.score ? Number(lead.score) : undefined,
      nextAction: lead.nextAction ?? undefined,
      createdAt: lead.createdAt,
    };
  }

  async listVisits(repId: string, filters: SalesVisitListFilters): Promise<SalesVisitListResult> {
    await this.ensureRepExists(repId);
    const { skip, take } = buildPagination(filters);
    const [total, visits] = await this.db.$transaction([
      this.db.salesVisit.count({ where: { repId } }),
      this.db.salesVisit.findMany({
        where: { repId },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    const data: SalesVisitRecord[] = visits.map((visit) => ({
      id: visit.id,
      repId: visit.repId,
      partnerId: visit.partnerId ?? undefined,
      date: visit.date ?? undefined,
      purpose: visit.purpose ?? undefined,
      result: visit.result ?? undefined,
      createdAt: visit.createdAt,
    }));

    return {
      data,
      total,
      page: filters.page ?? 1,
      pageSize: take,
    };
  }

  async createVisit(repId: string, input: SalesVisitInput): Promise<SalesVisitRecord> {
    const rep = await this.db.salesRep.findUnique({ where: { id: repId } });
    if (!rep) {
      throw notFound("Sales rep not found");
    }

    const visit = await this.db.salesVisit.create({
      data: {
        repId,
        brandId: rep.brandId ?? null,
        partnerId: input.partnerId ?? null,
        purpose: input.purpose,
        result: input.result,
        date: input.date ? new Date(input.date) : undefined,
      },
    });

    await publish(
      "sales-reps.visit.logged",
      { repId, visitId: visit.id },
      { module: "sales-reps" },
    );

    return {
      id: visit.id,
      repId: visit.repId,
      partnerId: visit.partnerId ?? undefined,
      date: visit.date ?? undefined,
      purpose: visit.purpose ?? undefined,
      result: visit.result ?? undefined,
      createdAt: visit.createdAt,
    };
  }

  async getKpis(repId: string): Promise<SalesKpiSummary> {
    const rep = await this.db.salesRep.findUnique({ where: { id: repId } });
    if (!rep) {
      throw notFound("Sales rep not found");
    }

    const [leadCount, visitCount, orderStats] = await this.db.$transaction([
      this.db.salesLead.count({ where: { repId } }),
      this.db.salesVisit.count({ where: { repId } }),
      this.db.salesOrder.aggregate({
        where: { repId },
        _count: { id: true },
        _sum: { total: true },
      }),
    ]);

    const totalOrders = orderStats._count?.id ?? 0;
    const totalRevenue = Number(orderStats._sum?.total ?? 0);
    const summary: SalesKpiSummary = {
      repId,
      totalLeads: leadCount,
      totalVisits: visitCount,
      totalOrders,
      totalRevenue,
      lastUpdated: new Date(),
    };

    await this.db.salesRepKpiSnapshot.create({
      data: {
        brandId: rep.brandId ?? null,
        repId,
        period: new Date().toISOString(),
        metricsJson: JSON.stringify({
          totalLeads: leadCount,
          totalVisits: visitCount,
          totalOrders,
          totalRevenue,
        }),
      },
    });

    await publish("sales-reps.kpi.snapshot", { repId }, { module: "sales-reps" });
    // TODO: Surface KPI snapshot and AI insights in the Virtual Office for the Sales Director.

    return summary;
  }

  async getAiPlan(repId: string, input: SalesRepAiPlanRequest): Promise<SalesRepAiPlanDto> {
    const rep = await this.db.salesRep.findUnique({ where: { id: repId } });
    if (!rep) {
      throw notFound("Sales rep not found");
    }

    const [leads, visits] = await this.db.$transaction([
      this.db.salesLead.findMany({
        where: { repId },
        orderBy: { updatedAt: "desc" },
        take: 8,
      }),
      this.db.salesVisit.findMany({
        where: { repId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    const kpis = await this.getKpis(repId);

    const leadContext = leads.map((lead) => ({
      leadId: lead.leadId ?? lead.id,
      name: lead.leadId ?? undefined,
      stage: lead.stage ?? undefined,
      status: lead.status,
      score: lead.score ? Number(lead.score) : undefined,
      lastInteraction: lead.updatedAt.toISOString(),
      nextAction: lead.nextAction ?? undefined,
      source: lead.source ?? undefined,
    }));

    const visitContext = visits.map((visit) => ({
      visitId: visit.id,
      partnerId: visit.partnerId ?? undefined,
      purpose: visit.purpose ?? undefined,
      result: visit.result ?? undefined,
      date: visit.date ? visit.date.toISOString() : undefined,
    }));

    const aiResponse = await aiOrchestrator.generateSalesRepPlan({
      brandId: rep.brandId ?? undefined,
      repId,
      scope: input.scope,
      notes: input.notes,
      leads: leadContext,
      visits: visitContext,
      kpis,
    });

    // TODO: Pipe AI-prioritized leads into CRM tasks or automation once approvals exist.
    return aiResponse.result;
  }

  private async ensureRepExists(repId: string) {
    const exists = await this.db.salesRep.findUnique({ where: { id: repId }, select: { id: true } });
    if (!exists) {
      throw notFound("Sales rep not found");
    }
  }
}

export const sales_repsService = new SalesRepsService();
