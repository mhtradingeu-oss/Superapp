import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma.js";
import { verifyToken } from "../../security/jwt.js";
import { unauthorized, forbidden } from "../errors.js";
import { hasPermission } from "../../security/rbac.js";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authGuard(requiredPermissions?: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(unauthorized());
    }

    const token = header.split(" ")[1];
    const payload = verifyToken(token);
    if (!payload) {
      return next(unauthorized());
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return next(unauthorized());
    }

    req.user = { id: user.id, email: user.email, role: user.role };

    if (requiredPermissions && !hasPermission(user, requiredPermissions)) {
      return next(forbidden());
    }

    return next();
  };
}
