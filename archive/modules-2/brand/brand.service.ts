import type { CreateBrandInput, UpdateBrandInput } from "./brand.types.js";

export const brandService = {
  async list() {
    // TODO: fetch brands via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch brand by id
    return { id };
  },

  async create(input: CreateBrandInput) {
    // TODO: create brand
    return { id: "new-brand-id", ...input };
  },

  async update(id: string, input: UpdateBrandInput) {
    // TODO: update brand
    return { id, ...input };
  },

  async remove(id: string) {
    // TODO: delete brand
    return { id };
  },
};
