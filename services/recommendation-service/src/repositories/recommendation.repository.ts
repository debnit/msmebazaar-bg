import { prisma } from "../db/prismaClient";
import type { RecommendationLog } from "@prisma/client";

export const createRecommendationLog = async (userId: string, items: any[]) => {
  return prisma.recommendationLog.create({
    data: { userId, items }
  });
};

export const getRecommendationsForUser = async (userId: string, limit = 5) => {
  return prisma.recommendationLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit
  });
};
