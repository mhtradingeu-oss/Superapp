import type { CreateLoyaltyInput, UpdateLoyaltyInput } from "./loyalty.types.js";

export const loyaltyService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateLoyaltyInput) {
    // TODO: create record
    return { id: `new-loyalty-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateLoyaltyInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
