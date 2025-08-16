import { Router } from "express";
import * as controller from "../controllers/loan.controller";
import { validateRequest } from "../middlewares/validateRequest";
import requireAuth from "../middlewares/requireAuth";
import { loanCtaSchema, loanApplicationSchema } from "@shared/validation";

const router = Router();
router.use(requireAuth);

router.post("/cta", validateRequest(loanCtaSchema), controller.loanCta);
router.post("/applications", validateRequest(loanApplicationSchema), controller.createLoan);
router.get("/applications", controller.listLoans); // fetch all for logged-in user

export default router;
