import { useAuth } from "@mobile/store/authStore";
import { FeatureGatingService } from "@mobile/services/FeatureGating/FeatureGatingService";
import { useState, useEffect } from "react";

export function useFeatureGating() {
  const { user } = useAuth();
  const [featureUsage, setFeatureUsage] = useState<Record<string, number>>({});

  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    return FeatureGatingService.canAccessFeature(user.roles[0], user.isPro || false, feature);
  };

  const hasReachedLimit = (feature: string, period: 'daily' | 'monthly' | 'total' = 'total'): boolean => {
    if (!user) return true;
    const currentUsage = featureUsage[feature] || 0;
    return FeatureGatingService.hasReachedLimit(user.roles[0], user.isPro || false, feature, currentUsage, period);
  };

  const getUpgradeMessage = (feature: string): string => {
    if (!user) return "Please login to access this feature";
    return FeatureGatingService.getUpgradeMessage(user.roles[0], feature);
  };

  const incrementUsage = (feature: string) => {
    setFeatureUsage(prev => ({
      ...prev,
      [feature]: (prev[feature] || 0) + 1
    }));
  };

  const getFeatureLimit = (feature: string) => {
    if (!user) return null;
    return FeatureGatingService.getFeatureLimit(user.roles[0], user.isPro || false, feature);
  };

  return {
    canAccess,
    hasReachedLimit,
    getUpgradeMessage,
    incrementUsage,
    getFeatureLimit,
    featureUsage
  };
}