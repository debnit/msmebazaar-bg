import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import { RecommendationController } from '../controllers/recommendation.controller';
import { validateRequest } from "../middlewares/validateRequest";
import { recommendationRequestSchema } from "@msmebazaar/shared/validation/recommendation.schema";

const router = Router();
router.use(requireAuth);

router.post(
  "/recommend",
  validateRequest(recommendationRequestSchema),
  RecommendationController.getPersonalizedRecommendations
);

router.get("/history", controller.getUserRecommendationHistory);
router.get("/listings", RecommendationController.getRecommendations);
router.post("/events", RecommendationController.logEvent);

export default router;
