import type { CreateCommunicationInput, UpdateCommunicationInput } from "./communication.types.js";

export const communicationService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateCommunicationInput) {
    // TODO: create record
    return { id: `new-communication-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateCommunicationInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
