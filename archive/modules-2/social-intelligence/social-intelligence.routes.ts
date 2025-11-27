import { Router } from "express";
import * as controller from "./social-intelligence.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createSocialIntelligenceSchema, updateSocialIntelligenceSchema } from "./social-intelligence.validators.js";

const router = Router();

router.get("/", requirePermission('social-intelligence:read'), controller.list);
router.get("/:id", requirePermission('social-intelligence:read'), controller.getById);
router.post("/", requirePermission('social-intelligence:create'), validateBody(createSocialIntelligenceSchema), controller.create);
router.put("/:id", requirePermission('social-intelligence:update'), validateBody(updateSocialIntelligenceSchema), controller.update);
router.delete("/:id", requirePermission('social-intelligence:delete'), controller.remove);

export { router };
