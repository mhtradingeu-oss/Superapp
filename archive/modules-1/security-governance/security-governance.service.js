import { prisma } from "../../core/prisma.js";
import { notFound } from "../../core/http/errors.js";
import { emitSecurityGovernanceCreated, emitSecurityGovernanceDeleted, emitSecurityGovernanceUpdated, } from "./security-governance.events.js";
const policySelect = {
    id: true,
    name: true,
    rulesJson: true,
    createdAt: true,
    updatedAt: true,
};
export const security_governanceService = {
    async list() {
        return prisma.policy.findMany({
            select: policySelect,
            orderBy: { createdAt: "desc" },
        });
    },
    async getById(id) {
        const policy = await prisma.policy.findUnique({ where: { id }, select: policySelect });
        if (!policy) {
            throw notFound("Policy not found");
        }
        return policy;
    },
    async create(input) {
        const policy = await prisma.policy.create({
            data: {
                name: input.name,
                rulesJson: input.rulesJson ?? null,
            },
            select: policySelect,
        });
        await emitSecurityGovernanceCreated({ id: policy.id, name: policy.name });
        return policy;
    },
    async update(id, input) {
        await ensurePolicyExists(id);
        const policy = await prisma.policy.update({
            where: { id },
            data: {
                name: input.name,
                rulesJson: input.rulesJson ?? null,
            },
            select: policySelect,
        });
        await emitSecurityGovernanceUpdated({ id: policy.id, name: policy.name });
        return policy;
    },
    async remove(id) {
        const policy = await prisma.policy.findUnique({ where: { id }, select: { id: true, name: true } });
        if (!policy) {
            throw notFound("Policy not found");
        }
        await prisma.policy.delete({ where: { id } });
        await emitSecurityGovernanceDeleted({ id: policy.id, name: policy.name });
        return { id };
    },
};
async function ensurePolicyExists(id) {
    const existing = await prisma.policy.findUnique({ where: { id }, select: { id: true } });
    if (!existing) {
        throw notFound("Policy not found");
    }
}
