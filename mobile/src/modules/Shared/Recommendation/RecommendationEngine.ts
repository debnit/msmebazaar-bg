import { apiClient } from "@mobile/api/apiClient";
import { useAuth } from "@mobile/store/authStore";

// Shared recommendation logic matching your frontend recommendation service
export interface Recommendation {
  id: string;
  title: string;
  description: string;
  score: number;
  type: "listing" | "business" | "opportunity";
}

export class RecommendationEngine {
  static async getRecommendations(userId: string, userRole: string): Promise<Recommendation[]> {
    try {
      const response = await apiClient.get<{ items: Recommendation[] }>(
        `/recommendations/listings?userId=${userId}&role=${userRole}&k=10`
      );
      return response.items || [];
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      return [];
    }
  }

  static async logUserEvent(eventType: string, itemId: string, userId: string) {
    try {
      await apiClient.post("/recommendations/events", {
        event_type: eventType,
        user_id: userId,
        item_id: itemId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log user event:", error);
    }
  }

  static async getPersonalizedListings(userId: string, role: string) {
    return this.getRecommendations(userId, role);
  }
}

// React hook for easy component integration
export function useRecommendations() {
  const { user } = useAuth();
  
  const getRecommendations = async () => {
    if (!user) return [];
    return RecommendationEngine.getRecommendations(user.id, user.roles[0]);
  };

  const logEvent = async (eventType: string, itemId: string) => {
    if (!user) return;
    return RecommendationEngine.logUserEvent(eventType, itemId, user.id);
  };

  return { getRecommendations, logEvent };
}