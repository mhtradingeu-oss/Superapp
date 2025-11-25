import type { CreateUserInput, UpdateUserInput } from "./users.types.js";

export const usersService = {
  async list() {
    // TODO: fetch users via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch user by id
    return { id };
  },

  async create(input: CreateUserInput) {
    // TODO: create user
    return { id: "new-user-id", ...input };
  },

  async update(id: string, input: UpdateUserInput) {
    // TODO: update user
    return { id, ...input };
  },

  async remove(id: string) {
    // TODO: delete user
    return { id };
  },
};
