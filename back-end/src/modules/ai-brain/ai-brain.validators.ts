import { z } from "zod";

export const createAiBrainSchema = z.object({
  name: z.string().optional(),
});

export const updateAiBrainSchema = createAiBrainSchema.partial();
