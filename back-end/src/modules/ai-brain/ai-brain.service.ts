import type { CreateAiBrainInput, UpdateAiBrainInput } from "./ai-brain.types.js";

export const ai_brainService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateAiBrainInput) {
    // TODO: create record
    return { id: `new-ai-brain-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateAiBrainInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
