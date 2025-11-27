import { z } from "zod";
export const createOperationsSchema = z.object({
    name: z.string().optional(),
});
export const updateOperationsSchema = createOperationsSchema.partial();
