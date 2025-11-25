import type { CreateDealersInput, UpdateDealersInput } from "./dealers.types.js";

export const dealersService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateDealersInput) {
    // TODO: create record
    return { id: `new-dealers-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateDealersInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
