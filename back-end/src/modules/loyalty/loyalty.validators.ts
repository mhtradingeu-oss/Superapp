import { z } from "zod";

export const createLoyaltySchema = z.object({
  name: z.string().optional(),
});

export const updateLoyaltySchema = createLoyaltySchema.partial();
