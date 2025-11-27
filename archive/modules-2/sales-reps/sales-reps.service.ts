import type { CreateSalesRepsInput, UpdateSalesRepsInput } from "./sales-reps.types.js";

export const sales_repsService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateSalesRepsInput) {
    // TODO: create record
    return { id: `new-sales-reps-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateSalesRepsInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
