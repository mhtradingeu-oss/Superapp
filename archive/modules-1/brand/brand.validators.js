import { z } from "zod";
export const createBrandSchema = z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
    description: z.string().optional(),
});
export const updateBrandSchema = createBrandSchema.partial();
