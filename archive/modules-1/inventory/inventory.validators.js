import { z } from "zod";
export const createInventorySchema = z.object({
    name: z.string().optional(),
});
export const updateInventorySchema = createInventorySchema.partial();
