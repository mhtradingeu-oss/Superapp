import type { CreateSecurityGovernanceInput, UpdateSecurityGovernanceInput } from "./security-governance.types.js";

export const security_governanceService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateSecurityGovernanceInput) {
    // TODO: create record
    return { id: `new-security-governance-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateSecurityGovernanceInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};
