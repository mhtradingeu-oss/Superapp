import type { Request, Response, NextFunction } from "express";
import { pricingService } from "./pricing.service.js";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await pricingService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await pricingService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
