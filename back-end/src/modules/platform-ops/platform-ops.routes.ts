import { Router } from "express";
import { requirePermission } from "../../core/security/rbac.js";
import { getHealth, listAudit, listErrors, listJobs, listSecurity } from "./platform-ops.controller.js";

const router = Router();

router.get("/health", requirePermission("ops:health"), getHealth);
router.get("/errors", requirePermission("ops:errors"), listErrors);
router.get("/jobs", requirePermission("ops:jobs"), listJobs);
router.get("/security", requirePermission("ops:security"), listSecurity);
router.get("/audit", requirePermission("ops:audit"), listAudit);

export { router };
