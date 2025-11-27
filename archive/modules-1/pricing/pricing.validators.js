import { z } from "zod";
export const createPricingSchema = z.object({
    name: z.string().optional(),
});
export const updatePricingSchema = createPricingSchema.partial();
