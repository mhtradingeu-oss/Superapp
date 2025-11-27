import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and may include hyphens");

export const createProductSchema = z.object({
  brandId: z.string().trim().min(1).optional(),
  categoryId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  sku: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  barcode: z.string().trim().min(5).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const listProductSchema = z.object({
  search: z.string().trim().min(1).optional(),
  brandId: z.string().trim().min(1).optional(),
  categoryId: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});
