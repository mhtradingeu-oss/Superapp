import type { CreateSocialIntelligenceInput, UpdateSocialIntelligenceInput } from "./social-intelligence.types.js";

export const social_intelligenceService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateSocialIntelligenceInput) {
    // TODO: create record
    return { id: `new-social-intelligence-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateSocialIntelligenceInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
