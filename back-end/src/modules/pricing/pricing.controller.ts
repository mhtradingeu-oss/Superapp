import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { pricingService } from "./pricing.service.js";
import {
  competitorPriceSchema,
  createPricingDraftSchema,
  listPricingSchema,
} from "./pricing.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listPricingSchema.safeParse(req.query);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const items = await pricingService.list(parsed.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await pricingService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await pricingService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function createDraft(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createPricingDraftSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const draft = await pricingService.createDraft(req.params.productId, parsed.data);
    res.status(201).json(draft);
  } catch (err) {
    next(err);
  }
}

export async function listDrafts(req: Request, res: Response, next: NextFunction) {
  try {
    const drafts = await pricingService.listDrafts(req.params.productId);
    res.json(drafts);
  } catch (err) {
    next(err);
  }
}

export async function addCompetitorPrice(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = competitorPriceSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const competitorPrice = await pricingService.addCompetitorPrice(req.params.productId, parsed.data);
    res.status(201).json(competitorPrice);
  } catch (err) {
    next(err);
  }
}

export async function listCompetitorPrices(req: Request, res: Response, next: NextFunction) {
  try {
    const competitors = await pricingService.listCompetitorPrices(req.params.productId);
    res.json(competitors);
  } catch (err) {
    next(err);
  }
}

export async function listLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await pricingService.listLogs(req.params.productId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

export async function suggestPrice(req: Request, res: Response, next: NextFunction) {
  try {
    const suggestion = await pricingService.generateAISuggestion(req.params.productId);
    res.json(suggestion);
  } catch (err) {
    next(err);
  }
}
