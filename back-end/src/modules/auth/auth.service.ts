import { prisma } from "../../core/prisma.js";
import { hashPassword, verifyPassword } from "../../core/security/password.js";
import { signToken } from "../../core/security/jwt.js";
import { badRequest, unauthorized } from "../../core/http/errors.js";

export const authService = {
  async register(input: { email: string; password: string; name?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw badRequest("Email already in use");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email,
        // Prisma schema uses `password` field; store the hashed password there
        password: passwordHash,
        // `User` model in schema doesn't include `name` field; omit it
        role: "USER",
        status: "ACTIVE",
      },
    });

    const token = signToken({ id: user.id, role: user.role });
    return { token, user: sanitizeUser(user) };
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) {
      throw unauthorized("Invalid credentials");
    }

    const match = await verifyPassword(input.password, user.password);
    if (!match) {
      throw unauthorized("Invalid credentials");
    }

    const token = signToken({ id: user.id, role: user.role });
    return { token, user: sanitizeUser(user) };
  },
};

function sanitizeUser(user: { password?: string } & Record<string, any>) {
  const { password, ...rest } = user;
  return rest;
}
