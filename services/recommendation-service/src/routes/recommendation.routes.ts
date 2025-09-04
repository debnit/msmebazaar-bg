import { Router } from "express";
import requireAuth from "../middlewares/requireAuth";
import {
  getPersonalizedRecommendations,
  getUserRecommendationHistory,
  
} from '../controllers/recommendation.controller';

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

router.get("/history", RecommendationController.getUserRecommendationHistory);
router.get("/listings", RecommendationController.getRecommendations);
router.post("/events", RecommendationController.logEvent);

export default router;
