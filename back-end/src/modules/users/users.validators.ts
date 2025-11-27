import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const listUsersSchema = z.object({
  search: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
});
