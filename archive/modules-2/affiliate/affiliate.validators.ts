import { z } from "zod";

export const createAffiliateSchema = z.object({
  name: z.string().optional(),
});

export const updateAffiliateSchema = createAffiliateSchema.partial();
