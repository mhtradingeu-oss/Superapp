import { z } from "zod";
export const createStandSchema = z.object({
    name: z.string().optional(),
});
export const updateStandSchema = createStandSchema.partial();
