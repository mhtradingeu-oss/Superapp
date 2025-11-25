import { z } from "zod";

export const createSecurityGovernanceSchema = z.object({
  name: z.string().optional(),
});

export const updateSecurityGovernanceSchema = createSecurityGovernanceSchema.partial();
