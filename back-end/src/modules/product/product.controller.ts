import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { productService } from "./product.service.js";
import { listProductSchema } from "./product.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listProductSchema.safeParse(req.query);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const items = await productService.list(parsed.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await productService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await productService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await productService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await productService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
