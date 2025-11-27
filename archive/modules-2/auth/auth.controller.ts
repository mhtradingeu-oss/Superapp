import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../core/security/rbac.js";
import { authService } from "./auth.service.js";

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
    const user = req.user;
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}
