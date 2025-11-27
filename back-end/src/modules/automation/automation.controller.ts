import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../../core/security/rbac.js";
import { badRequest } from "../../core/http/errors.js";
import { automationService } from "./automation.service.js";
import { createAutomationSchema, updateAutomationSchema } from "./automation.validators.js";

export async function list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const items = await automationService.list({ brandId: req.query.brandId as string | undefined });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const item = await automationService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createAutomationSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await automationService.create({ ...parsed.data, createdById: req.user?.id });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = updateAutomationSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await automationService.update(req.params.id, { ...parsed.data, createdById: req.user?.id });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await automationService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function runScheduled(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await automationService.runScheduled(new Date());
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function runNow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    await automationService.runRule(req.params.id);
    res.json({ id: req.params.id, status: "executed" });
  } catch (err) {
    next(err);
  }
}
