import type { CreateAffiliateInput, UpdateAffiliateInput } from "./affiliate.types.js";

export const affiliateService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateAffiliateInput) {
    // TODO: create record
    return { id: `new-affiliate-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateAffiliateInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
