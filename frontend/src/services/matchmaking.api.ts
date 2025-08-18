// frontend/src/services/matchmaking.api.ts
import apiClient from "./api-client";
import type { MatchmakingResult } from "@/types/marketplace";

export const getMatchesForMsme = (msmeId: string) =>
  apiClient.get<MatchmakingResult[]>(`/matchmaking/matches/${msmeId}`);
