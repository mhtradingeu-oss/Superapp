import type { CreateInventoryInput, UpdateInventoryInput } from "./inventory.types.js";

export const inventoryService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateInventoryInput) {
    // TODO: create record
    return { id: `new-inventory-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateInventoryInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
