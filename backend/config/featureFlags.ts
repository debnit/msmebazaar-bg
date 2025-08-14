import fs from "fs";
import path from "path";

export type FeatureMeta = {
  label: string;
  description: string;
  enabled: boolean;
  proOnly?: boolean;
  rolesEnabled?: string[];
  accessLevel?: string;
  rolloutPercentage?: number;
};

export const featureFlags: Record<string, FeatureMeta> = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../shared/featureFlags.json"), "utf8")
);

export const isFeatureEnabled = (feature: string) => featureFlags[feature]?.enabled ?? false;

export const isFeatureEnabledForRole = (feature: string, role: string) => {
  const f = featureFlags[feature];
  return f?.rolesEnabled?.includes(role) ?? false;
};

export const isInRollout = (feature: string, userId: string) => {
  const f = featureFlags[feature];
  if (!f || typeof f.rolloutPercentage !== "number") return true;
  if (f.rolloutPercentage >= 100) return true;
  const hash = Math.abs(hashString(userId + feature)) % 100;
  return hash < f.rolloutPercentage;
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  return hash;
};

/**
 * Backend enforcement: reject API call if not allowed
 */
export const canUserAccessFeature = (feature: string, { role, isPro, userId }: { role: string; isPro: boolean; userId: string }) => {
  const f = featureFlags[feature];
  if (!f?.enabled) return false;
  if (f.proOnly && !isPro && !isFeatureEnabledForRole(feature, role)) return false;
  if (!isInRollout(feature, userId)) return false;
  return true;
};
