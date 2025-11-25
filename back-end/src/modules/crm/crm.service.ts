import type { CreateCrmInput, UpdateCrmInput } from "./crm.types.js";

export const crmService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateCrmInput) {
    // TODO: create record
    return { id: `new-crm-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateCrmInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
