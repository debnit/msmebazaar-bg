import { UserRole } from "@shared/types";
import { Feature, FeatureMeta } from "../../../shared/config/featureFlagTypes";
import featureFlags from "../../../shared/config/featureFlags.json";

export const canUserAccessFeature = (
  feature: Feature,
  ctx: { role: string; isPro: boolean; userId: string }
): boolean => {
  const f: FeatureMeta | undefined = (featureFlags as Record<string, FeatureMeta>)[feature];
  if (!f?.enabled) return false;

  // Pro-only check: either must be pro or have a role enabled explicitly
  if (f.proOnly && !ctx.isPro && !(f.rolesEnabled?.includes(ctx.role as UserRole) ?? false)) {
    return false;
  }

  // Feature rollout percentage check (gradual rollout)
  if (typeof f.rolloutPercentage === "number" && f.rolloutPercentage < 100) {
    const hash = Math.abs(hashString(ctx.userId + feature)) % 100;
    if (hash >= f.rolloutPercentage) return false;
  }

  return true;
};

// Simple deterministic string hash function for rollout percentage check
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
