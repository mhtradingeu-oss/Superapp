import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { emitBrandCreated, emitBrandDeleted, emitBrandUpdated } from "./brand.events.js";
import type {
  BrandListParams,
  BrandResponse,
  BrandSettings,
  CreateBrandInput,
  PaginatedBrands,
  UpdateBrandInput,
} from "./brand.types.js";

const brandSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  countryOfOrigin: true,
  defaultCurrency: true,
  settingsJson: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BrandSelect;

class BrandService {
  constructor(private readonly db = prisma) {}

  async list(params: BrandListParams = {}): Promise<PaginatedBrands> {
    const { search, page = 1, pageSize = 20 } = params;
    const { skip, take } = buildPagination({ page, pageSize });

    const where: Prisma.BrandWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, items] = await this.db.$transaction([
      this.db.brand.count({ where }),
      this.db.brand.findMany({ where, select: brandSelect, orderBy: { createdAt: "desc" }, skip, take }),
    ]);

    return {
      data: items.map((brand) => this.mapResponse(brand)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<BrandResponse> {
    const brand = await this.db.brand.findUnique({ where: { id }, select: brandSelect });
    if (!brand) {
      throw notFound("Brand not found");
    }
    return this.mapResponse(brand);
  }

  async create(input: CreateBrandInput): Promise<BrandResponse> {
    await this.ensureSlugIsUnique(input.slug);
    const linkedUserIds = await this.resolveUsers(input.userIds);
    const settingsUpdates: BrandSettings = {
      ...(input.settings ?? {}),
      metadata: input.metadata,
      preferences: input.preferences,
      linkedUserIds,
    };
    const brandSettings = this.mergeSettings({}, settingsUpdates);

    const brand = await this.db.brand.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        countryOfOrigin: input.countryOfOrigin ?? null,
        defaultCurrency: input.defaultCurrency ?? null,
        settingsJson: this.serializeSettings(brandSettings),
      },
      select: brandSelect,
    });

    await emitBrandCreated({ id: brand.id, name: brand.name }, { brandId: brand.id, source: "api" });
    return this.mapResponse(brand);
  }

  async update(id: string, input: UpdateBrandInput): Promise<BrandResponse> {
    const existing = await this.db.brand.findUnique({ where: { id }, select: brandSelect });
    if (!existing) {
      throw notFound("Brand not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      await this.ensureSlugIsUnique(input.slug);
    }

    const linkedUserIds = await this.resolveUsers(input.userIds);
    const settingsUpdates: BrandSettings = {
      ...(input.settings ?? {}),
      metadata: input.metadata,
      preferences: input.preferences,
      linkedUserIds,
    };
    const mergedSettings = this.mergeSettings(this.parseSettings(existing.settingsJson), settingsUpdates);

    const updated = await this.db.brand.update({
      where: { id },
      data: {
        name: input.name ?? existing.name,
        slug: input.slug ?? existing.slug,
        description: input.description ?? existing.description,
        countryOfOrigin: input.countryOfOrigin ?? existing.countryOfOrigin,
        defaultCurrency: input.defaultCurrency ?? existing.defaultCurrency,
        settingsJson: this.serializeSettings(mergedSettings),
      },
      select: brandSelect,
    });

    await emitBrandUpdated({ id: updated.id, name: updated.name }, { brandId: updated.id, source: "api" });
    return this.mapResponse(updated);
  }

  async remove(id: string) {
    const brand = await this.db.brand.findUnique({ where: { id }, select: { id: true, name: true } });
    if (!brand) {
      throw notFound("Brand not found");
    }

    await this.db.brand.delete({ where: { id } });
    await emitBrandDeleted({ id: brand.id, name: brand.name }, { brandId: brand.id, source: "api" });
    return { id };
  }

  private parseSettings(settingsJson?: string | null): BrandSettings {
    if (!settingsJson) return {};
    try {
      const parsed = JSON.parse(settingsJson) as BrandSettings;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private serializeSettings(settings: BrandSettings): string | null {
    const cleaned = Object.keys(settings).length ? settings : null;
    return cleaned ? JSON.stringify(cleaned) : null;
  }

  private mergeSettings(current: BrandSettings, updates: BrandSettings): BrandSettings {
    const next: BrandSettings = { ...current };

    if (updates.metadata) {
      next.metadata = { ...(current.metadata ?? {}), ...updates.metadata };
    }

    if (updates.preferences) {
      next.preferences = { ...(current.preferences ?? {}), ...updates.preferences };
    }

    if (updates.linkedUserIds) {
      next.linkedUserIds = Array.from(new Set(updates.linkedUserIds));
    }

    const reservedKeys = new Set(["metadata", "preferences", "linkedUserIds"]);
    Object.entries(updates).forEach(([key, value]) => {
      if (!reservedKeys.has(key)) {
        next[key] = value;
      }
    });

    return next;
  }

  private mapResponse(record: Prisma.BrandGetPayload<{ select: typeof brandSelect }>): BrandResponse {
    return {
      id: record.id,
      name: record.name,
      slug: record.slug,
      description: record.description,
      countryOfOrigin: record.countryOfOrigin,
      defaultCurrency: record.defaultCurrency,
      settings: this.parseSettings(record.settingsJson),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private async ensureSlugIsUnique(slug: string) {
    const existing = await this.db.brand.findUnique({ where: { slug } });
    if (existing) {
      throw badRequest("Slug already in use");
    }
  }

  private async resolveUsers(userIds?: string[]) {
    if (!userIds || userIds.length === 0) return undefined;
    const uniqueIds = Array.from(new Set(userIds));
    const users = await this.db.user.findMany({ where: { id: { in: uniqueIds } }, select: { id: true } });
    if (users.length !== uniqueIds.length) {
      throw badRequest("One or more users do not exist");
    }
    return uniqueIds;
  }
}

export const brandService = new BrandService();
