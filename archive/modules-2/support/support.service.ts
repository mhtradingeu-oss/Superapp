import type { CreateSupportInput, UpdateSupportInput } from "./support.types.js";

export const supportService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateSupportInput) {
    // TODO: create record
    return { id: `new-support-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateSupportInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
