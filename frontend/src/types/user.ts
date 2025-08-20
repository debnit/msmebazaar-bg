export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  avatar?: string
  roles: UserRole[]
  businessId?: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  subscription?: SubscriptionPlan
  createdAt: Date
  updatedAt: Date
  lastLoginAt?: Date
  preferences?: UserPreferences
  kycStatus?: KYCStatus
  businessProfile?: BusinessProfile
}

export enum UserRole {
  BUYER = "BUYER",
  SELLER = "SELLER", 
  INVESTOR = "INVESTOR",
  AGENT = "AGENT",
  MSME_OWNER = "MSME_OWNER",
  FOUNDER = "FOUNDER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export interface SubscriptionPlan {
  id: string
  plan: "FREE" | "PRO"
  status: "ACTIVE" | "EXPIRED" | "CANCELLED"
  startDate: Date
  endDate?: Date
  features: string[]
  paymentMethod?: string
  amount?: number
  currency?: string
}

export interface UserPreferences {
  language: string
  timezone: string
  notifications: NotificationPreferences
  theme: "light" | "dark" | "system"
  currency: string
}

export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
  updates: boolean
}

export enum KYCStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS", 
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface BusinessProfile {
  id: string
  businessName: string
  businessType: BusinessType
  industryType: string
  registrationNumber?: string
  gstNumber?: string
  panNumber?: string
  udyamNumber?: string
  address: Address
  website?: string
  description?: string
  yearEstablished?: number
  employeeCount?: number
  annualTurnover?: number
  verificationStatus: VerificationStatus
  documents: BusinessDocument[]
}

export enum BusinessType {
  SOLE_PROPRIETORSHIP = "SOLE_PROPRIETORSHIP",
  PARTNERSHIP = "PARTNERSHIP",
  PRIVATE_LIMITED = "PRIVATE_LIMITED",
  PUBLIC_LIMITED = "PUBLIC_LIMITED",
  LLP = "LLP",
  OPC = "OPC",
  TRUST = "TRUST",
  SOCIETY = "SOCIETY",
  COOPERATIVE = "COOPERATIVE",
}

export interface Address {
  street: string
  city: string
  state: string
  pincode: string
  country: string
  landmark?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export interface BusinessDocument {
  id: string
  type: DocumentType
  name: string
  url: string
  uploadedAt: Date
  verifiedAt?: Date
  status: VerificationStatus
  expiryDate?: Date
}

export enum DocumentType {
  PAN_CARD = "PAN_CARD",
  GST_CERTIFICATE = "GST_CERTIFICATE",
  UDYAM_CERTIFICATE = "UDYAM_CERTIFICATE",
  BUSINESS_REGISTRATION = "BUSINESS_REGISTRATION",
  BANK_STATEMENT = "BANK_STATEMENT",
  ITR = "ITR",
  BALANCE_SHEET = "BALANCE_SHEET",
  PROFIT_LOSS = "PROFIT_LOSS",
  OTHER = "OTHER",
}

// API Response Types
export interface LoginResponse {
  success: boolean
  data?: {
    user: User
    token: string
    refreshToken: string
  }
  message?: string
}

export interface RegisterResponse {
  success: boolean
  data?: {
    user: User
    token: string
    requiresVerification: boolean
  }
  message?: string
}

export interface UserResponse {
  success: boolean
  data?: User
  message?: string
}

// Form Types
export interface LoginForm {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber?: string
  roles: UserRole[]
  businessName?: string
  acceptTerms: boolean
}

export interface ProfileUpdateForm {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  avatar?: File
  preferences?: Partial<UserPreferences>
}

export interface BusinessProfileForm {
  businessName: string
  businessType: BusinessType
  industryType: string
  registrationNumber?: string
  gstNumber?: string
  panNumber?: string
  udyamNumber?: string
  address: Address
  website?: string
  description?: string
  yearEstablished?: number
  employeeCount?: number
  annualTurnover?: number
}

