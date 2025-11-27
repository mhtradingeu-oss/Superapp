import type { Request, Response, NextFunction } from "express";
import { security_governanceService } from "./security-governance.service.js";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await security_governanceService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await security_governanceService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await security_governanceService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await security_governanceService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await security_governanceService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
