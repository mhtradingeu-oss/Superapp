import { z } from "zod";

export const createFinanceSchema = z.object({
  brandId: z.string().optional(),
  productId: z.string().optional(),
  channel: z.string().optional(),
  amount: z.number(),
  currency: z.string().optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
});

export const updateFinanceSchema = createFinanceSchema.partial();
