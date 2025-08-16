import { Router } from "express";
import * as controller from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema, loginSchema } from "@shared/validation/auth.schema";

const router = Router();

router.post("/register", validateRequest(registerSchema), controller.register);
router.post("/login", validateRequest(loginSchema), controller.login);

export default router;
