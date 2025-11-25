import express from "express";
import cors from "cors";
import { requestLogger } from "./core/http/middleware/request-logger.js";
import { errorHandler } from "./core/http/middleware/error-handler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/index.js";
import { brandRouter } from "./modules/brand/index.js";
import { productRouter } from "./modules/product/index.js";
import { pricingRouter } from "./modules/pricing/index.js";
import { crmRouter } from "./modules/crm/index.js";
import { marketingRouter } from "./modules/marketing/index.js";
import { sales_repsRouter } from "./modules/sales-reps/index.js";
import { dealersRouter } from "./modules/dealers/index.js";
import { partnersRouter } from "./modules/partners/index.js";
import { standRouter } from "./modules/stand/index.js";
import { affiliateRouter } from "./modules/affiliate/index.js";
import { loyaltyRouter } from "./modules/loyalty/index.js";
import { inventoryRouter } from "./modules/inventory/index.js";
import { financeRouter } from "./modules/finance/index.js";
import { white_labelRouter } from "./modules/white-label/index.js";
import { automationRouter } from "./modules/automation/index.js";
import { communicationRouter } from "./modules/communication/index.js";
import { knowledge_baseRouter } from "./modules/knowledge-base/index.js";
import { security_governanceRouter } from "./modules/security-governance/index.js";
import { adminRouter } from "./modules/admin/index.js";
import { ai_brainRouter } from "./modules/ai-brain/index.js";
import { social_intelligenceRouter } from "./modules/social-intelligence/index.js";
import { operationsRouter } from "./modules/operations/index.js";
import { supportRouter } from "./modules/support/index.js";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(requestLogger);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/pricing", pricingRouter);
  app.use("/api/v1/crm", crmRouter);
  app.use("/api/v1/marketing", marketingRouter);
  app.use("/api/v1/sales-reps", sales_repsRouter);
  app.use("/api/v1/dealers", dealersRouter);
  app.use("/api/v1/partners", partnersRouter);
  app.use("/api/v1/stand", standRouter);
  app.use("/api/v1/affiliate", affiliateRouter);
  app.use("/api/v1/loyalty", loyaltyRouter);
  app.use("/api/v1/inventory", inventoryRouter);
  app.use("/api/v1/finance", financeRouter);
  app.use("/api/v1/white-label", white_labelRouter);
  app.use("/api/v1/automation", automationRouter);
  app.use("/api/v1/communication", communicationRouter);
  app.use("/api/v1/knowledge", knowledge_baseRouter);
  app.use("/api/v1/security", security_governanceRouter);
  app.use("/api/v1/admin", adminRouter);
  app.use("/api/v1/ai", ai_brainRouter);
  app.use("/api/v1/social-intelligence", social_intelligenceRouter);
  app.use("/api/v1/operations", operationsRouter);
  app.use("/api/v1/support", supportRouter);

  app.use(errorHandler);

  return app;
}
