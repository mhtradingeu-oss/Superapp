import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { loyaltyService } from "./loyalty.service.js";
import { createLoyaltySchema, updateLoyaltySchema } from "./loyalty.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await loyaltyService.list({
      brandId: req.query.brandId as string | undefined,
      programId: req.query.programId as string | undefined,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await loyaltyService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createLoyaltySchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await loyaltyService.create(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateLoyaltySchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await loyaltyService.update(req.params.id, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await loyaltyService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
