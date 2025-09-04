import type { Request, Response } from "express";
import * as recoEngine from '../services/recoEngine';
import * as service from "../services/recommendation.service";

export const getPersonalizedRecommendations = async (req: Request & { user?: any; validated?: any }, res: Response) => {
  const { limit, filters } = req.validated;
  const recommendations = await service.getRecommendations(req.user.id, limit, filters);
  res.json({ success: true, data: recommendations });
};

export const getUserRecommendationHistory = async (req: Request & { user?: any }, res: Response) => {
  const logs = await service.getUserHistory(req.user.id);
  res.json({ success: true, data: logs });
};

export const RecommendationController = {
  getPersonalizedRecommendations,
  getUserRecommendationHistory,

  // Existing RecommendationController methods
  async getRecommendations(req: Request, res: Response) {
    const { userId, role, k = 20 } = req.query;
    if (typeof userId !== 'string') {
      return res.status(400).json({ error: "userId query parameter required" });
    }
    const userEmbedding = await recoEngine.getUserEmbedding(userId);
    const candidates = await recoEngine.getListingCandidates(userEmbedding, +k);
    const ranked = await recoEngine.rankCandidates(userId, candidates);
    res.json({ items: ranked });
  },

  async logEvent(req: Request, res: Response) {
    // TODO: Secure and validate input, save event to DB/Kafka
    res.status(204).send();
  }
};
