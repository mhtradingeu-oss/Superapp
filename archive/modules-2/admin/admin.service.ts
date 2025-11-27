import type { CreateAdminInput, UpdateAdminInput } from "./admin.types.js";

export const adminService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateAdminInput) {
    // TODO: create record
    return { id: `new-admin-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateAdminInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
