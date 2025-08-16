import type { Request, Response } from "express";
import * as service from "../services/recommendation.service";

export const getPersonalizedRecommendations = async (
  req: Request & { user?: any; validated?: any },
  res: Response
) => {
  const { limit, filters } = req.validated;
  const recommendations = await service.getRecommendations(req.user.id, limit, filters);
  res.json({ success: true, data: recommendations });
};

export const getUserRecommendationHistory = async (
  req: Request & { user?: any },
  res: Response
) => {
  const logs = await service.getUserHistory(req.user.id);
  res.json({ success: true, data: logs });
};
