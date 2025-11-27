import { z } from "zod";
export const createSocialIntelligenceSchema = z.object({
    name: z.string().optional(),
});
export const updateSocialIntelligenceSchema = createSocialIntelligenceSchema.partial();
