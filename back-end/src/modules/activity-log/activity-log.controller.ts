import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { activityLogService } from "./activity-log.service.js";
import { listActivityLogSchema } from "./activity-log.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listActivityLogSchema.safeParse(req.query);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const items = await activityLogService.list(parsed.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
}
