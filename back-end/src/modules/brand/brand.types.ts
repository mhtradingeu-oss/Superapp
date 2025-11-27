export interface BrandSettings {
  metadata?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  linkedUserIds?: string[];
  [key: string]: unknown;
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  description?: string | null;
  countryOfOrigin?: string | null;
  defaultCurrency?: string | null;
  metadata?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  userIds?: string[];
}

export interface UpdateBrandInput extends Partial<CreateBrandInput> {}

export interface BrandCreatedPayload {
  id: string;
  name: string;
}

export interface BrandResponse {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  countryOfOrigin?: string | null;
  defaultCurrency?: string | null;
  settings: BrandSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandListParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedBrands {
  data: BrandResponse[];
  total: number;
  page: number;
  pageSize: number;
}
