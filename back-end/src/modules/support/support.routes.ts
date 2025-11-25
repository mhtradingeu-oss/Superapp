import { Router } from "express";
import * as controller from "./support.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createSupportSchema, updateSupportSchema } from "./support.validators.js";

const router = Router();

router.get("/", requirePermission('support:read'), controller.list);
router.get("/:id", requirePermission('support:read'), controller.getById);
router.post("/", requirePermission('support:create'), validateBody(createSupportSchema), controller.create);
router.put("/:id", requirePermission('support:update'), validateBody(updateSupportSchema), controller.update);
router.delete("/:id", requirePermission('support:delete'), controller.remove);

export { router };
