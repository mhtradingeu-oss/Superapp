import { Router } from "express";
import * as controller from "./inventory.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createInventorySchema, updateInventorySchema } from "./inventory.validators.js";

const router = Router();

router.get("/", requirePermission('inventory:read'), controller.list);
router.get("/:id", requirePermission('inventory:read'), controller.getById);
router.post("/", requirePermission('inventory:create'), validateBody(createInventorySchema), controller.create);
router.put("/:id", requirePermission('inventory:update'), validateBody(updateInventorySchema), controller.update);
router.delete("/:id", requirePermission('inventory:delete'), controller.remove);

export { router };
