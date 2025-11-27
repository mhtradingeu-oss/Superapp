import { z } from "zod";
export const createPartnersSchema = z.object({
    name: z.string().optional(),
});
export const updatePartnersSchema = createPartnersSchema.partial();
