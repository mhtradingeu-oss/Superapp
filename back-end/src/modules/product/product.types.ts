export interface CreateProductInput {
  brandId?: string;
  categoryId?: string;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  status?: string | null;
  barcode?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface ProductEventPayload {
  id: string;
  brandId?: string | null;
}

export interface ProductPricingSnapshot {
  id: string;
  productId: string;
  brandId?: string | null;
  cogsEur?: number | null;
  fullCostEur?: number | null;
  b2cNet?: number | null;
  b2cGross?: number | null;
  dealerNet?: number | null;
  dealerPlusNet?: number | null;
  standPartnerNet?: number | null;
  distributorNet?: number | null;
  amazonNet?: number | null;
  uvpNet?: number | null;
  vatPct?: number | null;
}

export interface CompetitorPriceSnapshot {
  id: string;
  productId: string;
  brandId?: string | null;
  competitor: string;
  marketplace?: string | null;
  country?: string | null;
  priceNet?: number | null;
  priceGross?: number | null;
  currency?: string | null;
  collectedAt?: Date | null;
}

export interface ProductResponse {
  id: string;
  brandId?: string | null;
  categoryId?: string | null;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  status?: string | null;
  barcode?: string;
  pricing?: ProductPricingSnapshot | null;
  competitorPrices?: CompetitorPriceSnapshot[];
  inventoryItemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  search?: string;
  brandId?: string;
  categoryId?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedProducts {
  data: ProductResponse[];
  total: number;
  page: number;
  pageSize: number;
}
