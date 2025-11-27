import type { Request, Response, NextFunction } from "express";
import { ai_brainService, aiBrainInsightsService } from "./ai-brain.service.js";
import { aiOrchestrator } from "../../core/ai/orchestrator.js";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await ai_brainService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await ai_brainService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await ai_brainService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await ai_brainService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await ai_brainService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function insights(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiBrainInsightsService.summarize({
      brandName: req.body.brandName ?? "Brand",
      highlights: req.body.highlights ?? "No highlights",
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function assistantChat(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiOrchestrator.assistantChat({ message: req.body.message, brandId: req.body.brandId });
    res.json(result.result ?? result);
  } catch (err) {
    next(err);
  }
}
