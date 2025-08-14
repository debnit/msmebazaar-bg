import { Feature, FeatureMeta } from "../../shared/config/featureFlagTypes";
import featureFlags from "../../shared/config/featureFlags.json";

export const canUserAccessFeature = (
  feature: Feature,
  ctx: { role: string; isPro: boolean; userId: string }
) => {
  const f: FeatureMeta = (featureFlags as any)[feature];
  if (!f?.enabled) return false;

  if (f.proOnly && !ctx.isPro && !(f.rolesEnabled || []).includes(ctx.role as any))
    return false;

  if (typeof f.rolloutPercentage === "number" && f.rolloutPercentage < 100) {
    const hash = Math.abs(hashString(ctx.userId + feature)) % 100;
    if (hash >= f.rolloutPercentage) return false;
  }

  return true;
};

const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = (hash << 5) - hash + str.charCodeAt(i);
  return hash;
};
