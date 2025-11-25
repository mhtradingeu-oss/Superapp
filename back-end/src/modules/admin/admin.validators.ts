import { z } from "zod";

export const createAdminSchema = z.object({
  name: z.string().optional(),
});

export const updateAdminSchema = createAdminSchema.partial();
