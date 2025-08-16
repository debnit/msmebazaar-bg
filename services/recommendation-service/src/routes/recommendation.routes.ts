import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import * as controller from "../controllers/recommendation.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { recommendationRequestSchema } from "@shared/validation/recommendation.schema";

const router = Router();
router.use(requireAuth);

router.post(
  "/recommend",
  validateRequest(recommendationRequestSchema),
  controller.getPersonalizedRecommendations
);

router.get("/history", controller.getUserRecommendationHistory);

export default router;
