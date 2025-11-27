import { z } from "zod";

export const createCrmSchema = z.object({
  brandId: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: z.string().optional(),
  ownerId: z.string().optional(),
  sourceId: z.string().optional(),
});

export const updateCrmSchema = createCrmSchema.partial();
