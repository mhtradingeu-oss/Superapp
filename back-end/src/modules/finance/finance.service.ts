import type { CreateFinanceInput, UpdateFinanceInput } from "./finance.types.js";

export const financeService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateFinanceInput) {
    // TODO: create record
    return { id: `new-finance-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateFinanceInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
