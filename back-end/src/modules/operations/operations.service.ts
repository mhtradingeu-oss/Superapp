import type { CreateOperationsInput, UpdateOperationsInput } from "./operations.types.js";

export const operationsService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateOperationsInput) {
    // TODO: create record
    return { id: `new-operations-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateOperationsInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
