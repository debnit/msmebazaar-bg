import { Request, Response } from "express";
import matchmakingService from "../services/matchmaking.service";

export const createMatchController = async (req: Request, res: Response) => {
  try {
    const matchData = req.body; // incoming match data
    const createdMatch = await matchmakingService.createMatch(matchData);
    res.status(201).json(createdMatch);
  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ error: "Failed to create match" });
  }
};

export const getMatchesController = async (req: Request, res: Response) => {
  try {
    const { msmeId } = req.params;
    const matches = await matchmakingService.getMatchesByMsme(msmeId);
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to get matches" });
  }
};
