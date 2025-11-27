import { z } from "zod";
export const createAutomationSchema = z.object({
    name: z.string().optional(),
});
export const updateAutomationSchema = createAutomationSchema.partial();
