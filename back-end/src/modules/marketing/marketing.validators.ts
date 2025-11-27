import { z } from "zod";

export const createMarketingSchema = z.object({
  brandId: z.string().optional(),
  channelId: z.string().optional(),
  name: z.string().min(1),
  objective: z.string().optional(),
  budget: z.number().optional(),
  status: z.string().optional(),
});

export const updateMarketingSchema = createMarketingSchema.partial();
