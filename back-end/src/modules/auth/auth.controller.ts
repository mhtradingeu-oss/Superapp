import type { Request, Response } from "express";
import { authService } from "./auth.service.js";

export async function registerHandler(req: Request, res: Response) {
  const result = await authService.register(req.body);
  return res.json(result);
}

export async function loginHandler(req: Request, res: Response) {
  const result = await authService.login(req.body);
  return res.json(result);
}

export async function meHandler(req: Request, res: Response) {
  return res.json({ user: (req as any).user });
}
