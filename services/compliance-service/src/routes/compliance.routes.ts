import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import * as controller from "../controllers/compliance.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { complianceDocSchema } from "@shared/validation/compliance.schema";

const router = Router();
router.use(requireAuth);

router.post(
  "/doc",
  validateRequest(complianceDocSchema),
  controller.createDoc
);

router.get("/docs", controller.listUserDocs);

export default router;
