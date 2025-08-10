/**
 * User role types for MSMEBazaar platform
 */
export type UserRole = "msmeOwner" | "founder" | "buyer" | "seller" | "investor" | "agent" | "admin" | "superadmin"

/**
 * User subscription plan types
 */
export type SubscriptionPlan = "free" | "pro" | "enterprise"

/**
 * User interface representing a platform user
 */
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  businessName?: string
  phone?: string

  // Role and permissions
  roles: UserRole[]
  primaryRole: UserRole

  // Subscription and features
  subscriptionPlan: SubscriptionPlan
  isProUser: boolean
  proExpiresAt?: Date

  // Profile completion
  profileCompleted: boolean
  onboardingCompleted: boolean

  // Business details (for MSME owners)
  businessType?: string
  businessSize?: "micro" | "small" | "medium"
  industry?: string
  gstNumber?: string

  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date

  // Feature access
  featureAccess: {
    businessLoans: boolean
    businessValuation: boolean
    exitStrategy: boolean
    marketLinkage: boolean
    msmeNetworking: boolean
    compliance: boolean
    plantMachinery: boolean
    leadershipTraining: boolean
  }
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  name?: string
  businessName?: string
  phone?: string
  businessType?: string
  businessSize?: "micro" | "small" | "medium"
  industry?: string
  gstNumber?: string
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: string
  password: string
  name: string
  businessName?: string
  primaryRole: UserRole
  phone?: string
}
