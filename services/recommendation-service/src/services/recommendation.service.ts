import * as repo from "../repositories/recommendation.repository";

export async function getRecommendations(
  userId: string,
  limit = 5,
  filters?: Record<string, any>
) {
  // Placeholder: Insert actual ML model/service call here.
  const recommendations = [
    { id: "item1", title: "Top Product A", score: 0.95, metadata: { category: "FinTech" } },
    { id: "item2", title: "Top Service B", score: 0.93 }
  ];
  // Save log for audit
  await repo.createRecommendationLog(userId, recommendations);
  return recommendations.slice(0, limit);
}

export async function getUserHistory(userId: string) {
  return repo.getRecommendationsForUser(userId);
}
