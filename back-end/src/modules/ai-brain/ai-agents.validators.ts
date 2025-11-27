import { z } from "zod";

export const createAgentSchema = z.object({
  name: z.string().min(1),
  osScope: z.string().optional(),
  configJson: z.record(z.unknown()).optional(),
  brandId: z.string().optional(),
  enabled: z.boolean().optional(),
});

export const updateAgentSchema = createAgentSchema.partial();
