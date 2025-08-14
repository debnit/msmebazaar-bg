import { Feature } from "../../shared/config/featureFlagTypes";

export const featureServiceMap: Record<string, Feature> = {
  "analytics/advanced": Feature.ADVANCED_ANALYTICS,
  "reports/custom": Feature.CUSTOM_REPORTS,
  "payments/upgrade": Feature.PRO_UPGRADE,
  "payments/verify-upgrade": Feature.PRO_UPGRADE
};
