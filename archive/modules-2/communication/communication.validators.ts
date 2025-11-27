import { z } from "zod";

export const createCommunicationSchema = z.object({
  name: z.string().optional(),
});

export const updateCommunicationSchema = createCommunicationSchema.partial();
