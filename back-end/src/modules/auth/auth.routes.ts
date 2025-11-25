import { Router } from "express";
import { validateBody } from "../../core/http/middleware/validate.js";
import { authGuard } from "../../core/http/middleware/auth.js";
import { loginSchema, registerSchema } from "./auth.validators.js";
import { loginHandler, meHandler, registerHandler } from "./auth.controller.js";

const router = Router();

router.post("/register", validateBody(registerSchema), registerHandler);
router.post("/login", validateBody(loginSchema), loginHandler);
router.get("/me", authGuard(["auth:me"]), meHandler);

export default router;
