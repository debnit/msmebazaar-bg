/**
 * User role types for MSMEBazaar platform
 */
export type UserRole = "msmeOwner" | "buyer" | "seller" | "investor" | "agent" | "founder" | "admin" | "superadmin"

/**
 * User subscription plan types
 */
export type SubscriptionPlan = "free" | "pro"

/**
 * User interface representing a platform user
 */
export interface User {
  id: string
  email: string
  name: string
  businessName?: string
  phone?: string
  roles: UserRole[]
  primaryRole: UserRole
  subscriptionPlan: SubscriptionPlan
  isProActive: boolean
  proExpiresAt?: Date
  avatar?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  createdAt: Date
  updatedAt: Date
  onboardingCompleted: boolean
  kycStatus: "pending" | "verified" | "rejected"
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  name?: string
  businessName?: string
  phone?: string
  avatar?: string
}

/**
 * User registration data
 */
export interface UserRegistration {
  email: string
  password: string
  name: string
  businessName?: string
  phone?: string
  primaryRole: UserRole
}
