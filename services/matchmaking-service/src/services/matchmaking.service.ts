import prisma from "../db/prismaClient";
import { runMatchmakingAlgorithm } from "./matchmakingAlgorithm";
import { produceMatchmakingEvent } from "../kafka/producer";

class MatchmakingService {
  async processNewMsme(msme: any) {
    const matches = await runMatchmakingAlgorithm(msme);

    for (const match of matches) {
      await prisma.matchmaking.create({
        data: {
          msmeId: msme.id,
          matchedEntityId: match.id,
          score: match.score,
          createdAt: new Date(),
        },
      });

      await produceMatchmakingEvent({
        msmeId: msme.id,
        matchedEntityId: match.id,
        score: match.score,
      });
    }
  }

  async getMatchesByMsme(msmeId: string) {
    return prisma.matchmaking.findMany({ where: { msmeId } });
  }
}

export default new MatchmakingService();
