import type { Request, Response, NextFunction } from "express";
import { aiAgentsService } from "./ai-agents.service.js";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await aiAgentsService.list({ brandId: _req.query.brandId as string | undefined, scope: _req.query.scope as string | undefined }));
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await aiAgentsService.get(req.params.id));
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const agent = await aiAgentsService.create(req.body);
    res.status(201).json(agent);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const agent = await aiAgentsService.update(req.params.id, req.body);
    res.json(agent);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await aiAgentsService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function test(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await aiAgentsService.test(req.params.id, req.body ?? {});
    res.json(result);
  } catch (err) {
    next(err);
  }
}
