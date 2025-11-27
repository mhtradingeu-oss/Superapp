import type { Prisma } from "@prisma/client";
import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { buildPagination } from "../../core/utils/pagination.js";
import { emitProductCreated, emitProductDeleted, emitProductUpdated } from "./product.events.js";
import type {
  CreateProductInput,
  PaginatedProducts,
  ProductFilters,
  ProductPricingSnapshot,
  ProductResponse,
  UpdateProductInput,
} from "./product.types.js";

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
} satisfies Prisma.ProductPricingSelect;

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
} satisfies Prisma.CompetitorPriceSelect;

const productSelect = {
  id: true,
  brandId: true,
  categoryId: true,
  name: true,
  slug: true,
  description: true,
  sku: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  pricing: { select: pricingSelect },
  competitorPrices: { select: competitorSelect, orderBy: { collectedAt: "desc" }, take: 5 },
  _count: { select: { inventoryItems: true } },
} satisfies Prisma.BrandProductSelect;

class ProductService {
  constructor(private readonly db = prisma) {}

  async list(filters: ProductFilters = {}): Promise<PaginatedProducts> {
    const { search, brandId, categoryId, status, page = 1, pageSize = 20 } = filters;
    const { skip, take } = buildPagination({ page, pageSize });

    const where: Prisma.BrandProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const [total, products] = await this.db.$transaction([
      this.db.brandProduct.count({ where }),
      this.db.brandProduct.findMany({
        where,
        select: productSelect,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
    ]);

    return {
      data: products.map((product) => this.mapProduct(product)),
      total,
      page,
      pageSize: take,
    };
  }

  async getById(id: string): Promise<ProductResponse> {
    const product = await this.db.brandProduct.findUnique({ where: { id }, select: productSelect });
    if (!product) {
      throw notFound("Product not found");
    }
    return this.mapProduct(product);
  }

  async create(input: CreateProductInput): Promise<ProductResponse> {
    await this.ensureSlugUnique(input.slug);
    await this.ensureSkuUnique(input.sku ?? input.barcode);
    if (input.brandId) {
      await this.ensureBrandExists(input.brandId);
    }

    const product = await this.db.brandProduct.create({
      data: {
        brandId: input.brandId,
        categoryId: input.categoryId,
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        sku: input.sku ?? input.barcode ?? null,
        status: input.status ?? "ACTIVE",
      },
      select: productSelect,
    });

    await emitProductCreated({ id: product.id }, { brandId: product.brandId ?? undefined, source: "api" });
    return this.mapProduct(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<ProductResponse> {
    const existing = await this.db.brandProduct.findUnique({ where: { id }, select: productSelect });
    if (!existing) {
      throw notFound("Product not found");
    }

    if (input.slug && input.slug !== existing.slug) {
      await this.ensureSlugUnique(input.slug);
    }

    const nextSku = input.sku ?? input.barcode;
    if (nextSku && nextSku !== existing.sku) {
      await this.ensureSkuUnique(nextSku);
    }

    if (input.brandId && input.brandId !== existing.brandId) {
      await this.ensureBrandExists(input.brandId);
    }

    const updated = await this.db.brandProduct.update({
      where: { id },
      data: {
        brandId: input.brandId ?? existing.brandId,
        categoryId: input.categoryId ?? existing.categoryId,
        name: input.name ?? existing.name,
        slug: input.slug ?? existing.slug,
        description: input.description ?? existing.description,
        sku: nextSku ?? existing.sku,
        status: input.status ?? existing.status,
      },
      select: productSelect,
    });

    await emitProductUpdated({ id: updated.id }, { brandId: updated.brandId ?? undefined, source: "api" });
    return this.mapProduct(updated);
  }

  async remove(id: string) {
    const existing = await this.db.brandProduct.findUnique({ where: { id }, select: { id: true, brandId: true } });
    if (!existing) {
      throw notFound("Product not found");
    }

    await this.db.$transaction([
      this.db.productPriceDraft.deleteMany({ where: { productId: id } }),
      this.db.competitorPrice.deleteMany({ where: { productId: id } }),
      this.db.productPricing.deleteMany({ where: { productId: id } }),
      this.db.brandProduct.delete({ where: { id } }),
    ]);

    await emitProductDeleted({ id, brandId: existing.brandId ?? undefined }, { brandId: existing.brandId ?? undefined, source: "api" });
    return { id };
  }

  private mapProduct(record: Prisma.BrandProductGetPayload<{ select: typeof productSelect }>): ProductResponse {
    return {
      id: record.id,
      brandId: record.brandId ?? undefined,
      categoryId: record.categoryId ?? undefined,
      name: record.name,
      slug: record.slug,
      description: record.description ?? undefined,
      sku: record.sku ?? undefined,
      status: record.status ?? undefined,
      barcode: record.sku ?? undefined,
      pricing: this.mapPricing(record.pricing),
      competitorPrices: record.competitorPrices.map((price) => ({
        id: price.id,
        productId: price.productId,
        brandId: price.brandId ?? undefined,
        competitor: price.competitor,
        marketplace: price.marketplace ?? undefined,
        country: price.country ?? undefined,
        priceNet: this.decimalToNumber(price.priceNet),
        priceGross: this.decimalToNumber(price.priceGross),
        currency: price.currency ?? undefined,
        collectedAt: price.collectedAt ?? undefined,
      })),
      inventoryItemCount: record._count.inventoryItems,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private mapPricing(pricing: Prisma.ProductPricingGetPayload<{ select: typeof pricingSelect }> | null): ProductPricingSnapshot | null {
    if (!pricing) return null;
    return {
      id: pricing.id,
      productId: pricing.productId,
      brandId: pricing.brandId ?? undefined,
      cogsEur: this.decimalToNumber(pricing.cogsEur),
      fullCostEur: this.decimalToNumber(pricing.fullCostEur),
      b2cNet: this.decimalToNumber(pricing.b2cNet),
      b2cGross: this.decimalToNumber(pricing.b2cGross),
      dealerNet: this.decimalToNumber(pricing.dealerNet),
      dealerPlusNet: this.decimalToNumber(pricing.dealerPlusNet),
      standPartnerNet: this.decimalToNumber(pricing.standPartnerNet),
      distributorNet: this.decimalToNumber(pricing.distributorNet),
      amazonNet: this.decimalToNumber(pricing.amazonNet),
      uvpNet: this.decimalToNumber(pricing.uvpNet),
      vatPct: this.decimalToNumber(pricing.vatPct),
    };
  }

  private decimalToNumber(value?: Prisma.Decimal | null) {
    if (value === null || value === undefined) return null;
    return Number(value);
  }

  private async ensureSlugUnique(slug: string) {
    const existing = await this.db.brandProduct.findUnique({ where: { slug } });
    if (existing) {
      throw badRequest("Product slug already in use");
    }
  }

  private async ensureSkuUnique(sku?: string | null) {
    if (!sku) return;
    const existing = await this.db.brandProduct.findUnique({ where: { sku } });
    if (existing) {
      throw badRequest("SKU already in use");
    }
  }

  private async ensureBrandExists(brandId: string) {
    const brand = await this.db.brand.findUnique({ where: { id: brandId }, select: { id: true } });
    if (!brand) {
      throw badRequest("Brand not found for provided brandId");
    }
  }
}

export const productService = new ProductService();
