import type { NextFunction, Request, Response } from "express";
import { badRequest } from "../../core/http/errors.js";
import { standPosService } from "./stand-pos.service.js";
import { standListSchema, standAiStockSchema } from "./stand-pos.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  const validated = standListSchema.safeParse(req.query);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const result = await standPosService.list(validated.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const stand = await standPosService.getById(req.params.id);
    res.json(stand);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const stand = await standPosService.create(req.body);
    res.status(201).json(stand);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {

  try {
    const stand = await standPosService.update(req.params.id, req.body);
    res.json(stand);
  } catch (err) {
    next(err);
  }
}

export async function getInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const locationId = typeof req.query.locationId === "string" ? req.query.locationId : undefined;
    const inventory = await standPosService.getInventory(req.params.id, locationId);
    res.json(inventory);
  } catch (err) {
    next(err);
  }
}

export async function createRefill(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await standPosService.createRefill(req.params.id, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPerformance(req: Request, res: Response, next: NextFunction) {
  try {
    const summary = await standPosService.getPerformance(req.params.id);
    res.json(summary);
  } catch (err) {
    next(err);
  }
}

export async function getAiStockSuggestion(req: Request, res: Response, next: NextFunction) {
  const validated = standAiStockSchema.safeParse(req.body);
  if (!validated.success) {
    return next(badRequest("Validation error", validated.error.flatten()));
  }

  try {
    const result = await standPosService.getAiStockSuggestion(req.params.id, validated.data);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
