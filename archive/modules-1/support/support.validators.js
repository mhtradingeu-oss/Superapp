import { z } from "zod";
export const createSupportSchema = z.object({
    name: z.string().optional(),
});
export const updateSupportSchema = createSupportSchema.partial();
