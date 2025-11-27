import { z } from "zod";
export const createSalesRepsSchema = z.object({
    name: z.string().optional(),
});
export const updateSalesRepsSchema = createSalesRepsSchema.partial();
