import rawFlags from "../../../shared/config/featureFlags.json";
import { Feature, AccessLevel, UserRole } from "@/types/feature";

export interface FeatureMeta {
  label: string;
  description: string;
  enabled: boolean;
  proOnly?: boolean;
  rolesEnabled?: UserRole[];
  accessLevel?: AccessLevel;
  rolloutPercentage?: number;
}

export const featureFlags: Record<Feature, FeatureMeta> = rawFlags as Record<Feature, FeatureMeta>;

/** ----- Helpers ----- */

/** Global check: is feature switched on */
export const isFeatureEnabled = (feature: Feature) => featureFlags[feature]?.enabled ?? false;

/** Check if role has default access to feature */
export const isFeatureEnabledForRole = (feature: Feature, role: UserRole) => {
  const f = featureFlags[feature];
  return f?.rolesEnabled?.includes(role) ?? false;
};

/** Rollout bucket check for experimental release */
export const isInRollout = (feature: Feature, userId: string) => {
  const f = featureFlags[feature];
  if (!f || typeof f.rolloutPercentage !== "number") return true; // default allow
  if (f.rolloutPercentage >= 100) return true;
  // Simple hash-based percentage bucket
  const hash = Math.abs(hashString(userId + feature)) % 100;
  return hash < f.rolloutPercentage;
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return hash;
};

/** Final access decision (frontend) */
export const canUserAccessFeature = (
  feature: Feature,
  { role, isPro, userId }: { role: UserRole; isPro: boolean; userId: string }
) => {
  const f = featureFlags[feature];
  if (!f?.enabled) return false;
  if (f.proOnly && !isPro && !isFeatureEnabledForRole(feature, role)) return false;
  if (!isInRollout(feature, userId)) return false;
  return true;
};
