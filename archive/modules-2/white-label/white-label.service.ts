import type { CreateWhiteLabelInput, UpdateWhiteLabelInput } from "./white-label.types.js";

export const white_labelService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateWhiteLabelInput) {
    // TODO: create record
    return { id: `new-white-label-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateWhiteLabelInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
