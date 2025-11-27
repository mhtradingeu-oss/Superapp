import type { Request, Response, NextFunction } from "express";
import { aiInsightsService } from "./ai-insights.service.js";
import { insightsQuerySchema, kpiQuerySchema, reportsQuerySchema } from "./ai-insights.validators.js";

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await aiInsightsService.refresh({ brandId: req.body.brandId, scope: req.body.scope });
    res.status(201).json(items);
  } catch (err) {
    next(err);
  }
}

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const params = insightsQuerySchema.parse(_req.query);
    res.json(await aiInsightsService.list(params));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await aiInsightsService.get(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function createReport(req: Request, res: Response, next: NextFunction) {
  try {
    const report = await aiInsightsService.createReport(req.body);
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

export async function listReports(_req: Request, res: Response, next: NextFunction) {
  try {
    const params = reportsQuerySchema.parse(_req.query);
    res.json(await aiInsightsService.listReports(params));
  } catch (err) {
    next(err);
  }
}

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await aiInsightsService.getReport(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function getReportRendered(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await aiInsightsService.getReportRendered(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function kpiSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const params = kpiQuerySchema.parse(req.query);
    const summary = await aiInsightsService.kpiSummary(params);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}
