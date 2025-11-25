import type { CreatePartnersInput, UpdatePartnersInput } from "./partners.types.js";

export const partnersService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreatePartnersInput) {
    // TODO: create record
    return { id: `new-partners-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdatePartnersInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
