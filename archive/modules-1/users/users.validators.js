import { z } from "zod";
export const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.string().optional(),
});
export const updateUserSchema = createUserSchema.partial();
