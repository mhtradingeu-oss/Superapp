import type { Response, NextFunction } from "express";
import { forbidden } from "../errors.js";
import { authenticateRequest, hasPermission, type AuthenticatedRequest } from "../../security/rbac.js";

export function authGuard(requiredPermissions?: string[]) {
  return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    try {
      const user = await authenticateRequest(req);
      if (requiredPermissions && requiredPermissions.length && !hasPermission(user, requiredPermissions)) {
        return next(forbidden());
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
}
