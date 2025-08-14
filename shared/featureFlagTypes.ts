// src/shared/featureFlagTypes.ts

/**
 * All available feature keys in MSMEBazaar.
 *
 * These must exactly match the keys in featureFlags.json.
 * Keeping them here ensures type safety across UI and backend.
 */
export enum Feature {
  ADVANCED_ANALYTICS = "ADVANCED_ANALYTICS",
  CUSTOM_REPORTS = "CUSTOM_REPORTS",
  PRIORITY_SUPPORT = "PRIORITY_SUPPORT",
  BULK_OPERATIONS = "BULK_OPERATIONS",
  API_ACCESS = "API_ACCESS",
  // Add more as they're added to featureFlags.json
}

/**
 * Access control levels for a feature.
 * Determines what the user can do if they have access.
 */
export enum AccessLevel {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

/**
 * User roles valid in the MSMEBazaar system.
 * Keep in sync with authentication/authorization logic.
 */
export enum UserRole {
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  MSME_OWNER = "msmeOwner",
  SELLER = "seller",
  BUYER = "buyer",
  AGENT = "agent",
  INVESTOR = "investor",
  DEVELOPER = "developer"
}

/**
 * Type for a single feature's metadata — matches the JSON schema.
 */
export interface FeatureMeta {
  label: string;
  description: string;
  enabled: boolean;
  proOnly?: boolean;
  rolesEnabled?: UserRole[];          // Roles that can access without Pro
  accessLevel?: AccessLevel;
  rolloutPercentage?: number;         // 0-100 % rollout
  expiry?: string;                    // ISO date string, e.g., "2025-12-31T23:59:59Z"
  availableRegions?: string[];        // ISO country codes
}

/**
 * Helper type for the whole feature flag config object.
 * Keys are Feature enum values, values are FeatureMeta objects.
 */
export type FeatureFlagConfig = Record<Feature, FeatureMeta>;
