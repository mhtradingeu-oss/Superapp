import { Prisma } from "@prisma/client";
import type { StandLocation } from "@prisma/client";
import { aiOrchestrator } from "../../core/ai/orchestrator.js";
import { prisma } from "../../core/prisma.js";
import { publish } from "../../core/events/event-bus.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { notFound } from "../../core/http/errors.js";
import type {
  StandAiStockRequest,
  StandCreateInput,
  StandInventoryResponse,
  StandListFilters,
  StandListResult,
  StandLocationInput,
  StandPerformanceSummary,
  StandRefillInput,
  StandRefillResult,
  StandUpdateInput,
} from "./stand-pos.types.js";

class StandPosService {
  constructor(private readonly db = prisma) {}

  async list(filters: StandListFilters): Promise<StandListResult> {
    const { skip, take } = buildPagination(filters);
    const where: Prisma.StandWhereInput = {};
    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.partnerId) where.standPartnerId = filters.partnerId;
    if (filters.status) where.status = filters.status;

    const [total, records] = await this.db.$transaction([
      this.db.stand.count({ where }),
      this.db.stand.findMany({
        where,
        include: {
          standPartner: {
            include: {
              partner: { select: { id: true, name: true } },
            },
          },
          locations: true,
          performanceSnapshots: { orderBy: { createdAt: "desc" }, take: 1 },
          refillOrders: { orderBy: { expectedAt: "desc", createdAt: "desc" }, take: 1 },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data: records.map((stand) => ({
        id: stand.id,
        name: stand.name,
        standType: stand.standType ?? undefined,
        description: stand.description ?? undefined,
        status: stand.status,
        brandId: stand.brandId ?? undefined,
        partner: stand.standPartner?.partner
          ? {
              id: stand.standPartner.partner.id,
              name: stand.standPartner.partner.name ?? undefined,
              status: stand.standPartner.status ?? undefined,
            }
          : undefined,
        locationCount: stand.locations.length,
        latestSnapshot: stand.performanceSnapshots[0]
          ? {
              period: stand.performanceSnapshots[0].period ?? undefined,
              metrics: stand.performanceSnapshots[0].metricsJson
                ? JSON.parse(stand.performanceSnapshots[0].metricsJson)
                : undefined,
            }
          : undefined,
        lastRefillAt: stand.refillOrders[0]?.completedAt ?? stand.refillOrders[0]?.expectedAt ?? undefined,
      })),
      total,
      page: filters.page ?? 1,
      pageSize: take,
    };
  }

  async getById(id: string) {
    const stand = await this.db.stand.findUnique({
      where: { id },
      include: {
        standPartner: {
          include: {
            partner: { select: { id: true, name: true } },
          },
        },
        locations: {
          include: {
            inventories: { include: { product: { select: { id: true, name: true } } } },
          },
        },
        packages: true,
      },
    });

    if (!stand) {
      throw notFound("Stand not found");
    }

    return stand;
  }

  async create(input: StandCreateInput) {
    const stand = await this.db.stand.create({
      data: {
        brandId: input.brandId ?? null,
        standPartnerId: input.standPartnerId,
        name: input.name,
        standType: input.standType,
        description: input.description,
        status: input.status ?? "ACTIVE",
      },
    });

    if (input.initialLocation) {
      await this.createLocation(stand.id, stand.standPartnerId, input.initialLocation);
    }

    await publish(
      "stand-pos.stand.created",
      { standId: stand.id, brandId: stand.brandId ?? undefined },
      { module: "stand-pos" },
    );

    return stand;
  }

  async update(id: string, input: StandUpdateInput) {
    const stand = await this.db.stand.update({
      where: { id },
      data: {
        name: input.name ?? undefined,
        standType: input.standType ?? undefined,
        description: input.description ?? undefined,
        status: input.status ?? undefined,
      },
    });

    await publish("stand-pos.stand.updated", { standId: stand.id }, { module: "stand-pos" });
    return stand;
  }

  async getInventory(standId: string, standLocationId?: string): Promise<StandInventoryResponse[]> {
    const locations = await this.db.standLocation.findMany({
      where: {
        standId,
        ...(standLocationId ? { id: standLocationId } : {}),
      },
      include: {
        inventories: {
          include: {
            product: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    if (!locations.length) {
      return [];
    }

    return locations.map((location) => ({
      locationId: location.id,
      locationName: location.name,
      inventory: location.inventories.map((record) => ({
        productId: record.productId,
        productName: record.product?.name ?? undefined,
        quantity: record.quantity,
        status: record.status ?? undefined,
        lastRefillAt: record.lastRefillAt ?? undefined,
      })),
    }));
  }

  async createRefill(standId: string, data: StandRefillInput): Promise<StandRefillResult> {
    const location = await this.db.standLocation.findFirst({
      where: { id: data.standLocationId, standId },
      include: { stand: { select: { id: true, standPartnerId: true, name: true, brandId: true } } },
    });

    if (!location) {
      throw notFound("Stand location not found");
    }

    const standUnitId = await this.ensureLocationUnit(
      location,
      location.stand.standPartnerId,
      location.name,
    );

    const order = await this.db.standRefillOrder.create({
      data: {
        brandId: location.stand.brandId ?? null,
        standId,
        standLocationId: location.id,
        partnerId: data.partnerId ?? location.stand.standPartnerId,
        status: "PLANNED",
        expectedAt: data.expectedAt ? new Date(data.expectedAt) : undefined,
        source: data.source,
        notes: data.notes,
      },
    });

    const now = new Date();

    await Promise.all(
      data.items.map(async (item) => {
        await this.db.standRefillItem.create({
          data: {
            refillOrderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            cost: item.cost ? new Prisma.Decimal(item.cost) : undefined,
            refillSource: item.refillSource,
          },
        });

        const existingInventory = await this.db.standInventory.findFirst({
          where: {
            standLocationId: location.id,
            productId: item.productId,
          },
        });

        if (existingInventory) {
          await this.db.standInventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: { increment: item.quantity },
              lastRefillAt: now,
            },
          });
        } else {
          await this.db.standInventory.create({
            data: {
              standUnitId,
              standLocationId: location.id,
              productId: item.productId,
              quantity: item.quantity,
              status: "ACTIVE",
              lastRefillAt: now,
            },
          });
        }
      }),
    );

    await this.db.standPerformanceSnapshot.create({
      data: {
        standId,
        standLocationId: location.id,
        brandId: location.stand.brandId ?? null,
        period: new Date().toISOString(),
        metricsJson: JSON.stringify({
          itemsRefilled: data.items.length,
          totalQuantity: data.items.reduce((sum, item) => sum + item.quantity, 0),
        }),
      },
    });

    await publish(
      "stand-pos.refill.created",
      { standId, standLocationId: location.id, refillOrderId: order.id },
      { module: "stand-pos" },
    );

    // TODO: Invoke AI Brain/Virtual Office when refill performance falls below expected cadence.

    return {
      id: order.id,
      status: order.status ?? "PLANNED",
      standLocationId: location.id,
      expectedAt: order.expectedAt ?? undefined,
    };
  }

  async getPerformance(standId: string): Promise<StandPerformanceSummary> {
    const stand = await this.db.stand.findUnique({ where: { id: standId } });
    if (!stand) {
      throw notFound("Stand not found");
    }

    const [orders, pendingRefills, latestSnapshot, lastRefill] = await this.db.$transaction([
      this.db.standOrder.aggregate({
        where: { standId },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.db.standRefillOrder.count({
        where: { standId, status: "PLANNED" },
      }),
      this.db.standPerformanceSnapshot.findFirst({
        where: { standId },
        orderBy: { createdAt: "desc" },
      }),
      this.db.standRefillOrder.findFirst({
        where: { standId, expectedAt: { not: null } },
        orderBy: { expectedAt: "desc" },
        select: { expectedAt: true },
      }),
    ]);

    const stockOutEntries = await this.db.standInventory.count({
      where: {
        standLocation: {
          standId,
        },
        quantity: { lte: 0 },
      },
    });

    const summary: StandPerformanceSummary = {
      standId,
      standName: stand.name,
      totalOrders: orders._count?.id ?? 0,
      totalRevenue: Number(orders._sum?.total ?? 0),
      stockOutLocations: stockOutEntries,
      refillOrdersPending: pendingRefills,
      lastRefillAt: lastRefill?.expectedAt ?? undefined,
      latestSnapshot: latestSnapshot
        ? {
            period: latestSnapshot.period ?? undefined,
            metrics: latestSnapshot.metricsJson ? JSON.parse(latestSnapshot.metricsJson) : undefined,
          }
        : undefined,
    };

    await publish(
      "stand-pos.performance.reviewed",
      { standId, standName: stand.name },
      { module: "stand-pos", severity: "info" },
    );

    // TODO: Queue automation/notifications when stock-out counts rise or KPI snapshots regress.

    return summary;
  }

  async getAiStockSuggestion(standId: string, input: StandAiStockRequest) {
    const stand = await this.db.stand.findUnique({
      where: { id: standId },
      include: {
        locations: {
          include: {
            inventories: {
              include: {
                product: { select: { id: true, name: true, sku: true } },
              },
            },
          },
        },
      },
    });

    if (!stand) {
      throw notFound("Stand not found");
    }

    const performance = await this.getPerformance(standId);
    const performanceBrief = {
      ...performance,
      lastRefillAt: performance.lastRefillAt ? performance.lastRefillAt.toISOString() : undefined,
    };
    const inventorySnapshot = stand.locations.flatMap((location) =>
      location.inventories.map((inventory) => ({
        locationId: location.id,
        locationName: location.name,
        productId: inventory.productId,
        sku: inventory.product?.sku ?? undefined,
        name: inventory.product?.name ?? undefined,
        quantity: inventory.quantity,
        status: inventory.status ?? undefined,
        lastRefillAt: inventory.lastRefillAt?.toISOString(),
      })),
    );

    const aiResponse = await aiOrchestrator.generateStandStockSuggestion({
      brandId: stand.brandId ?? undefined,
      standId,
      scope: input.scope,
      notes: input.notes,
      inventorySnapshot,
      performance: performanceBrief,
    });

    // TODO: Once automation drafts exist, route low-stock suggestions directly into refill orders.
    return aiResponse.result;
  }

  private async createLocation(standId: string, partnerId: string, input: StandLocationInput) {
    const location = await this.db.standLocation.create({
      data: {
        standId,
        name: input.name,
        address: input.address,
        city: input.city,
        country: input.country,
        region: input.region,
        geoLocationJson: input.geoLocationJson,
      },
    });
    await this.ensureLocationUnit(location, partnerId, input.name);
    return location;
  }

  private async ensureLocationUnit(
    location: StandLocation,
    partnerId: string,
    locationName?: string,
  ) {
    const code = `loc-${location.id}`;
    const existing = await this.db.standUnit.findFirst({
      where: {
        standId: location.standId,
        code,
      },
    });

    if (existing) {
      return existing.id;
    }

    const unit = await this.db.standUnit.create({
      data: {
        standPartnerId: partnerId,
        standId: location.standId,
        code,
        locationDescription: locationName,
        status: "ACTIVE",
      },
    });

    return unit.id;
  }
}

export const standPosService = new StandPosService();
