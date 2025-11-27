import { prisma } from "../../core/prisma.js";
import { badRequest, notFound } from "../../core/http/errors.js";
import { hashPassword } from "../../core/security/password.js";
import { getPermissionsForRole } from "../../core/security/rbac.js";
import { emitUserCreated, emitUserDeleted, emitUserUpdated } from "./users.events.js";
const userSelect = {
    id: true,
    email: true,
    role: true,
    status: true,
    createdAt: true,
    updatedAt: true,
};
export const usersService = {
    async list() {
        const users = await prisma.user.findMany({
            select: userSelect,
            orderBy: { createdAt: "desc" },
        });
        return Promise.all(users.map(attachPermissions));
    },
    async getById(id) {
        const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
        if (!user) {
            throw notFound("User not found");
        }
        return attachPermissions(user);
    },
    async create(input) {
        const existing = await prisma.user.findUnique({ where: { email: input.email } });
        if (existing) {
            throw badRequest("Email already in use");
        }
        const role = input.role ?? "USER";
        await ensureRole(role);
        const passwordHash = await hashPassword(input.password);
        const user = await prisma.user.create({
            data: {
                email: input.email,
                password: passwordHash,
                role,
                status: "ACTIVE",
            },
            select: userSelect,
        });
        await emitUserCreated({ id: user.id, email: user.email });
        return attachPermissions(user);
    },
    async update(id, input) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw notFound("User not found");
        }
        const updates = {};
        if (input.email && input.email !== user.email) {
            const emailOwner = await prisma.user.findUnique({ where: { email: input.email } });
            if (emailOwner && emailOwner.id !== id) {
                throw badRequest("Email already in use");
            }
            updates.email = input.email;
        }
        if (input.password) {
            updates.password = await hashPassword(input.password);
        }
        if (input.role && input.role !== user.role) {
            await ensureRole(input.role);
            updates.role = input.role;
        }
        if (Object.keys(updates).length === 0) {
            return attachPermissions({
                id: user.id,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }
        const updated = await prisma.user.update({
            where: { id },
            data: updates,
            select: userSelect,
        });
        await emitUserUpdated({ id: updated.id, email: updated.email });
        return attachPermissions(updated);
    },
    async remove(id) {
        const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true } });
        if (!user) {
            throw notFound("User not found");
        }
        await prisma.user.delete({ where: { id } });
        await emitUserDeleted({ id: user.id, email: user.email });
        return { id };
    },
};
async function ensureRole(role) {
    const roleRecord = await prisma.role.findUnique({ where: { name: role } });
    if (!roleRecord) {
        throw badRequest(`Role ${role} is not provisioned`);
    }
}
async function attachPermissions(user) {
    const permissions = await getPermissionsForRole(user.role);
    return { ...user, permissions };
}
