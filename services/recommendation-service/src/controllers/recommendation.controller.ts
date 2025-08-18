import * as recoEngine from '../services/recoEngine';

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

export const RecommendationController = {
  async getRecommendations(req, res) {
    const { userId, role, k = 20 } = req.query;
    const userEmbedding = await recoEngine.getUserEmbedding(userId);
    const candidates = await recoEngine.getListingCandidates(userEmbedding, +k);
    const ranked = await recoEngine.rankCandidates(userId, candidates);
    res.json({ items: ranked });
  },
  async logEvent(req, res) {
    // Secure and validate input, save event
    // Optionally push to Kafka for retraining/analytics
    res.status(204).send();
  }
};

