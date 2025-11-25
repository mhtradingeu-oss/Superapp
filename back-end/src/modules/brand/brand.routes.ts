import { Router } from "express";
import * as controller from "./brand.controller.js";
import { requirePermission } from "../../core/security/rbac.js";
import { validateBody } from "../../core/http/middleware/validate.js";
import { createBrandSchema, updateBrandSchema } from "./brand.validators.js";

const router = Router();

router.get("/", requirePermission("brand:read"), controller.list);
router.get("/:id", requirePermission("brand:read"), controller.getById);
router.post("/", requirePermission("brand:create"), validateBody(createBrandSchema), controller.create);
router.put("/:id", requirePermission("brand:update"), validateBody(updateBrandSchema), controller.update);
router.delete("/:id", requirePermission("brand:delete"), controller.remove);

export { router };
