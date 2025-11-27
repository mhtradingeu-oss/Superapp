import type { NextFunction, Request, Response } from "express";
import { prisma } from "../prisma.js";
import { verifyToken } from "./jwt.js";
import { forbidden, unauthorized } from "../http/errors.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

type CachedPermissions = {
  permissions: string[];
  fetchedAt: number;
};

const rolePermissionCache = new Map<string, CachedPermissions>();
const PERMISSIONS_CACHE_TTL_MS = 60_000;

async function fetchRolePermissions(roleName: string): Promise<string[]> {
  if (roleName === "SUPER_ADMIN") {
    return ["*"];
  }

  const cached = rolePermissionCache.get(roleName);
  const isFresh = cached && Date.now() - cached.fetchedAt < PERMISSIONS_CACHE_TTL_MS;
  if (cached && isFresh) {
    return cached.permissions;
  }

  const role = await prisma.role.findUnique({
    where: { name: roleName },
    select: {
      permissions: {
        select: {
          permission: { select: { code: true } },
        },
      },
    },
  });

  const permissions = role?.permissions.map((rp) => rp.permission.code) ?? [];
  rolePermissionCache.set(roleName, { permissions, fetchedAt: Date.now() });
  return permissions;
}

export async function getPermissionsForRole(roleName: string): Promise<string[]> {
  return fetchRolePermissions(roleName);
}

export function hasPermission(user: Pick<AuthenticatedUser, "role" | "permissions">, required: string[]): boolean {
  if (user.role === "SUPER_ADMIN") return true;
  const assigned = user.permissions ?? [];
  return required.some((permission) => assigned.includes(permission));
}

async function authenticateRequest(req: AuthenticatedRequest): Promise<AuthenticatedUser> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    throw unauthorized();
  }

  const token = header.split(" ")[1];
  const payload = verifyToken(token);
  if (!payload) {
    throw unauthorized();
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  if (!userRecord || userRecord.status !== "ACTIVE") {
    throw unauthorized();
  }

  const permissions = await fetchRolePermissions(userRecord.role);
  const user: AuthenticatedUser = {
    id: userRecord.id,
    email: userRecord.email,
    role: userRecord.role,
    permissions,
  };

  req.user = user;
  return user;
}

export function requirePermission(permission: string | string[]) {
  const requiredPermissions = Array.isArray(permission) ? permission : [permission];
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const user = await authenticateRequest(req);
      if (requiredPermissions.length && !hasPermission(user, requiredPermissions)) {
        return next(forbidden());
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export { authenticateRequest };
