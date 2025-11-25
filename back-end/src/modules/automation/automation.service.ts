import type { CreateAutomationInput, UpdateAutomationInput } from "./automation.types.js";

export const automationService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateAutomationInput) {
    // TODO: create record
    return { id: `new-automation-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateAutomationInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
