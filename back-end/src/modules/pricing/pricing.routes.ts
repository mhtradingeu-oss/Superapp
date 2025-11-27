import { Router } from "express";
import * as controller from "./pricing.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import {
  competitorPriceSchema,
  createPricingDraftSchema,
  createPricingSchema,
  updatePricingSchema,
} from "./pricing.validators.js";

const router = Router();

router.get("/", requirePermission("pricing:read"), controller.list);
router.get("/product/:productId/drafts", requirePermission("pricing:read"), controller.listDrafts);
router.post(
  "/product/:productId/drafts",
  requirePermission("pricing:update"),
  validateBody(createPricingDraftSchema),
  controller.createDraft,
);
router.get("/product/:productId/competitors", requirePermission("pricing:read"), controller.listCompetitorPrices);
router.post(
  "/product/:productId/competitors",
  requirePermission("pricing:update"),
  validateBody(competitorPriceSchema),
  controller.addCompetitorPrice,
);
router.get("/product/:productId/logs", requirePermission("pricing:read"), controller.listLogs);
router.post("/product/:productId/ai/suggest", requirePermission(["ai:pricing", "pricing:update"]), controller.suggestPrice);
router.get("/:id", requirePermission("pricing:read"), controller.getById);
router.post("/", requirePermission("pricing:create"), validateBody(createPricingSchema), controller.create);
router.put("/:id", requirePermission("pricing:update"), validateBody(updatePricingSchema), controller.update);
router.delete("/:id", requirePermission("pricing:delete"), controller.remove);

export { router };
