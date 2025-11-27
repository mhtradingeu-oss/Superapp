import { prisma } from "../../core/prisma.js";
import { hashPassword, verifyPassword } from "../../core/security/password.js";
import { signToken } from "../../core/security/jwt.js";
import { badRequest, unauthorized } from "../../core/http/errors.js";
import { getPermissionsForRole } from "../../core/security/rbac.js";
import { emitUserCreated } from "../users/users.events.js";

const DEFAULT_ROLE = "USER";

const userSessionSelect = {
  id: true,
  email: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export const authService = {
  async register(input: { email: string; password: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw badRequest("Email already in use");
    }

    await ensureRoleProvisioned(DEFAULT_ROLE);

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        password: passwordHash,
        role: DEFAULT_ROLE,
        status: "ACTIVE",
      },
      select: userSessionSelect,
    });

    await emitUserCreated({ id: user.id, email: user.email });

    return buildSession(user);
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw unauthorized("Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
      throw unauthorized("Account is not active");
    }

    const match = await verifyPassword(input.password, user.password);
    if (!match) {
      throw unauthorized("Invalid credentials");
    }

    const sessionUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: userSessionSelect,
    });

    if (!sessionUser) {
      throw unauthorized("Invalid credentials");
    }

    return buildSession(sessionUser);
  },
};

async function ensureRoleProvisioned(role: string) {
  const roleRecord = await prisma.role.findUnique({ where: { name: role } });
  if (!roleRecord) {
    throw badRequest(`Role ${role} is not provisioned`);
  }
}

type SessionUser = {
  id: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

async function buildSession(user: SessionUser) {
  const permissions = await getPermissionsForRole(user.role);
  const token = signToken({ id: user.id, role: user.role });
  return { token, user: { ...user, permissions } };
}
