import type { Request, Response, NextFunction } from "express";
import { platformOpsService } from "./platform-ops.service.js";
import {
  listPlatformOpsAuditSchema,
  listPlatformOpsErrorSchema,
  listPlatformOpsJobsSchema,
} from "./platform-ops.validators.js";

export async function getHealth(_req: Request, res: Response, next: NextFunction) {
  try {
    const health = await platformOpsService.getHealth();
    res.json(health);
  } catch (err) {
    next(err);
  }
}

export async function listErrors(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listPlatformOpsErrorSchema.parse(req.query);
    const data = await platformOpsService.listErrors(parsed);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listPlatformOpsJobsSchema.parse(req.query);
    const data = await platformOpsService.listJobs(parsed.status);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listSecurity(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await platformOpsService.listSecurity();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function listAudit(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listPlatformOpsAuditSchema.parse(req.query);
    const data = await platformOpsService.listAudit(parsed);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
