export interface CreatePricingInput {
  productId: string;
  brandId?: string;
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

export interface UpdatePricingInput extends Partial<CreatePricingInput> {}

export interface PricingEventPayload {
  id: string;
  productId?: string;
  brandId?: string;
}

export interface PricingRecord {
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
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPricingParams {
  productId?: string;
  brandId?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedPricing {
  data: PricingRecord[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateDraftInput {
  brandId?: string;
  channel: string;
  oldNet?: number | null;
  newNet?: number | null;
  status?: string;
  createdById?: string;
  approvedById?: string;
}

export interface CompetitorPriceInput {
  brandId?: string;
  competitor: string;
  marketplace?: string;
  country?: string;
  priceNet?: number | null;
  priceGross?: number | null;
  currency?: string;
  collectedAt?: Date | null;
}

export interface CompetitorPriceRecord extends CompetitorPriceInput {
  id: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PricingLogRecord {
  id: string;
  productId: string;
  brandId?: string | null;
  channel?: string | null;
  oldNet?: number | null;
  newNet?: number | null;
  aiAgent?: string | null;
  confidenceScore?: number | null;
  summary?: string | null;
  createdAt: Date;
}

export interface PricingAISuggestion {
  suggestedPrice: number | null;
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  competitorSummary?: string;
  confidenceScore?: number;
}

export interface PricingDraftRecord {
  id: string;
  productId: string;
  brandId?: string | null;
  channel: string;
  oldNet?: number | null;
  newNet?: number | null;
  status?: string | null;
  createdById?: string | null;
  approvedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
