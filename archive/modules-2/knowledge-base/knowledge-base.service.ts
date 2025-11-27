import type { CreateKnowledgeBaseInput, UpdateKnowledgeBaseInput } from "./knowledge-base.types.js";

export const knowledge_baseService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateKnowledgeBaseInput) {
    // TODO: create record
    return { id: `new-knowledge-base-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateKnowledgeBaseInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
