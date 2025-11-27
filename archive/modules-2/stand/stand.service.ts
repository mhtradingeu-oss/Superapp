import type { CreateStandInput, UpdateStandInput } from "./stand.types.js";

export const standService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateStandInput) {
    // TODO: create record
    return { id: `new-stand-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateStandInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
