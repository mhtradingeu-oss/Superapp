import type { Request, Response, NextFunction } from "express";
import { sales_repsService } from "./sales-reps.service.js";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await sales_repsService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await sales_repsService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await sales_repsService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await sales_repsService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await sales_repsService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
