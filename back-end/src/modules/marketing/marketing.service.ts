import type { CreateMarketingInput, UpdateMarketingInput } from "./marketing.types.js";

export const marketingService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateMarketingInput) {
    // TODO: create record
    return { id: `new-marketing-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateMarketingInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
