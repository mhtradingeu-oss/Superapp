import { z } from "zod";
export const createDealersSchema = z.object({
    name: z.string().optional(),
});
export const updateDealersSchema = createDealersSchema.partial();
