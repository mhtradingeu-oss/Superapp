import type { CreatePricingInput, UpdatePricingInput } from "./pricing.types.js";

export const pricingService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreatePricingInput) {
    // TODO: create record
    return { id: `new-pricing-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdatePricingInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
