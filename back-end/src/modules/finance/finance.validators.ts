import { z } from "zod";

export const createFinanceSchema = z.object({
  name: z.string().optional(),
});

export const updateFinanceSchema = createFinanceSchema.partial();
