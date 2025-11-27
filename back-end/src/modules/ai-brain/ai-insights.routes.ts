import { Router } from "express";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import * as controller from "./ai-insights.controller.js";
import { refreshInsightsSchema, createReportSchema } from "./ai-insights.validators.js";

const router = Router();

router.post("/refresh", requirePermission(["ai:run", "ai:manage"]), validateBody(refreshInsightsSchema), controller.refresh);
router.get("/", requirePermission("ai:read"), controller.list);
router.get("/:id", requirePermission("ai:read"), controller.getById);
router.post("/reports", requirePermission(["ai:run", "ai:manage"]), validateBody(createReportSchema), controller.createReport);
router.get("/reports/list", requirePermission("ai:read"), controller.listReports);
router.get("/reports/:id/render", requirePermission("ai:read"), controller.getReportRendered);
router.get("/reports/:id", requirePermission("ai:read"), controller.getReport);
router.get("/kpi/summary", requirePermission("ai:read"), controller.kpiSummary);

export { router };
