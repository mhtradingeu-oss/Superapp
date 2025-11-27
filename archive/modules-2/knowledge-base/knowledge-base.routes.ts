import { Router } from "express";
import * as controller from "./knowledge-base.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createKnowledgeBaseSchema, updateKnowledgeBaseSchema } from "./knowledge-base.validators.js";

const router = Router();

router.get("/", requirePermission('knowledge-base:read'), controller.list);
router.get("/:id", requirePermission('knowledge-base:read'), controller.getById);
router.post("/", requirePermission('knowledge-base:create'), validateBody(createKnowledgeBaseSchema), controller.create);
router.put("/:id", requirePermission('knowledge-base:update'), validateBody(updateKnowledgeBaseSchema), controller.update);
router.delete("/:id", requirePermission('knowledge-base:delete'), controller.remove);

export { router };
