import { z } from "zod";

export const createLoyaltySchema = z.object({
  brandId: z.string().optional(),
  programId: z.string(),
  userId: z.string().optional(),
  personId: z.string().optional(),
  pointsBalance: z.number().int().optional(),
  tier: z.string().optional(),
});

export const updateLoyaltySchema = createLoyaltySchema
  .extend({
    pointsDelta: z.number().int().optional(),
    reason: z.string().optional(),
  })
  .partial();
