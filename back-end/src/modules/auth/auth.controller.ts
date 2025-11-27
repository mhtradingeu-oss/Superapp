import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import type { AuthenticatedRequest } from "../../core/security/rbac.js";

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return next(err);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

export async function meHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user?.id) {
      return res.status(401).end();
    }
    const user = await authService.me(req.user.id);
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}
