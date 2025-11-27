import { z } from "zod";

const decimalField = z.union([z.coerce.number(), z.null()]).optional();

export const createPricingSchema = z.object({
  productId: z.string().trim().min(1),
  brandId: z.string().trim().min(1).optional(),
  cogsEur: decimalField,
  fullCostEur: decimalField,
  b2cNet: decimalField,
  b2cGross: decimalField,
  dealerNet: decimalField,
  dealerPlusNet: decimalField,
  standPartnerNet: decimalField,
  distributorNet: decimalField,
  amazonNet: decimalField,
  uvpNet: decimalField,
  vatPct: decimalField,
});

export const updatePricingSchema = createPricingSchema.partial();

export const createPricingDraftSchema = z.object({
  brandId: z.string().trim().min(1).optional(),
  channel: z.string().trim().min(1),
  oldNet: decimalField,
  newNet: decimalField,
  status: z.string().trim().min(1).optional(),
  createdById: z.string().trim().min(1).optional(),
  approvedById: z.string().trim().min(1).optional(),
});

export const competitorPriceSchema = z.object({
  brandId: z.string().trim().min(1).optional(),
  competitor: z.string().trim().min(1),
  marketplace: z.string().trim().min(1).optional(),
  country: z.string().trim().min(1).optional(),
  priceNet: decimalField,
  priceGross: decimalField,
  currency: z.string().trim().length(3).optional(),
  collectedAt: z.coerce.date().optional(),
});

export const listPricingSchema = z.object({
  productId: z.string().trim().min(1).optional(),
  brandId: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});
