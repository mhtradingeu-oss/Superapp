import { z } from "zod";

export const createMarketingSchema = z.object({
  name: z.string().optional(),
});

export const updateMarketingSchema = createMarketingSchema.partial();
