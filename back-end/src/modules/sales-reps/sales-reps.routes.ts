import { Router } from "express";
import * as controller from "./sales-reps.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createSalesRepsSchema, updateSalesRepsSchema } from "./sales-reps.validators.js";

const router = Router();

router.get("/", requirePermission('sales-reps:read'), controller.list);
router.get("/:id", requirePermission('sales-reps:read'), controller.getById);
router.post("/", requirePermission('sales-reps:create'), validateBody(createSalesRepsSchema), controller.create);
router.put("/:id", requirePermission('sales-reps:update'), validateBody(updateSalesRepsSchema), controller.update);
router.delete("/:id", requirePermission('sales-reps:delete'), controller.remove);

export { router };
