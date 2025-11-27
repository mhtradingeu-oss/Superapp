import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { crmService, crmServiceAI } from "./crm.service.js";
import { createCrmSchema, updateCrmSchema } from "./crm.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await crmService.list({
      brandId: req.query.brandId as string | undefined,
      status: req.query.status as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await crmService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createCrmSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await crmService.create(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateCrmSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await crmService.update(req.params.id, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await crmService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function aiScore(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await crmServiceAI.scoreLead(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
