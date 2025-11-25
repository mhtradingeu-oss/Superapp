import express from "express";
import cors from "cors";
import { requestLogger } from "./core/http/middleware/request-logger.js";
import { errorHandler } from "./core/http/middleware/error-handler.js";
import authRoutes from "./modules/auth/auth.routes.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRoutes);

  app.use(errorHandler);

  return app;
}
