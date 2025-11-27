import type { Request, Response, NextFunction } from "express";
import { badRequest } from "../../core/http/errors.js";
import { usersService } from "./users.service.js";
import { listUsersSchema } from "./users.validators.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = listUsersSchema.safeParse(req.query);
    if (!parsed.success) {
      return next(badRequest("Validation error", parsed.error.flatten()));
    }
    const items = await usersService.list(parsed.data);
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await usersService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await usersService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await usersService.update(req.params.id, req.body);
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await usersService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
