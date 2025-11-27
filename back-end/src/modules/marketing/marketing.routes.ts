import { Router } from "express";
import * as controller from "./marketing.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createMarketingSchema, updateMarketingSchema } from "./marketing.validators.js";

const router = Router();

router.get("/", requirePermission('marketing:read'), controller.list);
router.get("/:id", requirePermission('marketing:read'), controller.getById);
router.post("/", requirePermission('marketing:create'), validateBody(createMarketingSchema), controller.create);
router.put("/:id", requirePermission('marketing:update'), validateBody(updateMarketingSchema), controller.update);
router.delete("/:id", requirePermission('marketing:delete'), controller.remove);
router.post("/ai/generate", requirePermission(['ai:marketing','marketing:update']), controller.generateContent);
router.post("/ai/seo", requirePermission(['ai:marketing','marketing:update']), controller.generateSeo);
router.post("/ai/captions", requirePermission(['ai:marketing','marketing:update']), controller.generateCaptions);

export { router };
