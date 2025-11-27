import { z } from "zod";

const settingsSchema = z.record(z.unknown()).optional();

export const createBrandSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase, alphanumeric, and may include hyphens"),
  description: z.string().optional(),
  countryOfOrigin: z.string().trim().min(2).max(60).optional(),
  defaultCurrency: z.string().trim().length(3).optional(),
  metadata: settingsSchema,
  preferences: settingsSchema,
  settings: settingsSchema,
  userIds: z.array(z.string().trim().min(1)).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

export const listBrandSchema = z.object({
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});
