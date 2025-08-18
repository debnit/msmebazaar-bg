import { Request, Response } from "express";
import matchmakingService from "../services/matchmaking.service";

export const MatchmakingController = {
  async getMatches(req: Request, res: Response) {
    const { msmeId } = req.params;
    const matches = await matchmakingService.getMatchesByMsme(msmeId);
    res.json(matches);
  },
};
