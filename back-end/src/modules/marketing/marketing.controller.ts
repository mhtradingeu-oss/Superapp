import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { marketingService, marketingAIService } from "./marketing.service.js";
import { createMarketingSchema, updateMarketingSchema } from "./marketing.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await marketingService.list({
      brandId: req.query.brandId as string | undefined,
      status: req.query.status as string | undefined,
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await marketingService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createMarketingSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await marketingService.create(parsed.data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = updateMarketingSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const item = await marketingService.update(req.params.id, parsed.data);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await marketingService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function generateContent(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await marketingAIService.generate(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function generateSeo(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await marketingAIService.seo(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function generateCaptions(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await marketingAIService.captions(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
