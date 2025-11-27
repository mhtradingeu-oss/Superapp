import { z } from "zod";
export const createSecurityGovernanceSchema = z.object({
    name: z.string().min(1),
    rulesJson: z.string().optional(),
});
export const updateSecurityGovernanceSchema = createSecurityGovernanceSchema.partial();
