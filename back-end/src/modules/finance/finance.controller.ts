import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { financeService } from "./finance.service.js";
import { createFinanceSchema, updateFinanceSchema } from "./finance.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await financeService.list({
      brandId: req.query.brandId as string | undefined,
      productId: req.query.productId as string | undefined,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await financeService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createFinanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await financeService.create(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateFinanceSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await financeService.update(req.params.id, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await financeService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
