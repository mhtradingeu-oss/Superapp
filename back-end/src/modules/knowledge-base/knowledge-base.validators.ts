import { z } from "zod";

export const createKnowledgeBaseSchema = z.object({
  name: z.string().optional(),
});

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.partial();
