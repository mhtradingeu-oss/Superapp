import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details ?? null,
    });
  }

  console.error("Unhandled error", err);
  return res.status(500).json({
    error: "Internal Server Error",
  });
}
