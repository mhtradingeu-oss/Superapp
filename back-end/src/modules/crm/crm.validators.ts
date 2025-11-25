import { z } from "zod";

export const createCrmSchema = z.object({
  name: z.string().optional(),
});

export const updateCrmSchema = createCrmSchema.partial();
