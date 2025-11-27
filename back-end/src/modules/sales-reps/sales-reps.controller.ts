import type { NextFunction, Request, Response } from "express";
import { badRequest } from "../../core/http/errors.js";
import { sales_repsService } from "./sales-reps.service.js";
import {
  listSalesLeadsSchema,
  listSalesRepsSchema,
  listSalesVisitsSchema,
  salesRepAiPlanSchema,
} from "./sales-reps.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  const validated = listSalesRepsSchema.safeParse(req.query);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const result = await sales_repsService.list(validated.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const rep = await sales_repsService.getById(req.params.id);
    res.json(rep);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const rep = await sales_repsService.create(req.body);
    res.status(201).json(rep);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const rep = await sales_repsService.update(req.params.id, req.body);
    res.json(rep);
  } catch (err) {
    next(err);
  }
}

export async function listLeads(req: Request, res: Response, next: NextFunction) {
  const validated = listSalesLeadsSchema.safeParse(req.query);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const result = await sales_repsService.listLeads(req.params.id, validated.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createLead(req: Request, res: Response, next: NextFunction) {
  try {
    const lead = await sales_repsService.createLead(req.params.id, req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
}

export async function listVisits(req: Request, res: Response, next: NextFunction) {
  const validated = listSalesVisitsSchema.safeParse(req.query);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const result = await sales_repsService.listVisits(req.params.id, validated.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function createVisit(req: Request, res: Response, next: NextFunction) {
  try {
    const visit = await sales_repsService.createVisit(req.params.id, req.body);
    res.status(201).json(visit);
  } catch (err) {
    next(err);
  }
}

export async function getKpis(req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await sales_repsService.getKpis(req.params.id);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

export async function getAiPlan(req: Request, res: Response, next: NextFunction) {
  const validated = salesRepAiPlanSchema.safeParse(req.body);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const plan = await sales_repsService.getAiPlan(req.params.id, validated.data);
    res.json(plan);
  } catch (err) {
    next(err);
  }
}
