import { z } from "zod";

export const createWhiteLabelSchema = z.object({
  name: z.string().optional(),
});

export const updateWhiteLabelSchema = createWhiteLabelSchema.partial();
