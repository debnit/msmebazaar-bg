import { z } from "zod";

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  profileImage: z.string().url().optional(),
  businessName: z.string().max(100).optional(),
  businessType: z.enum([
    "SOLE_PROPRIETORSHIP", "PARTNERSHIP", "LIMITED_LIABILITY_PARTNERSHIP",
    "PRIVATE_LIMITED", "PUBLIC_LIMITED", "ONE_PERSON_COMPANY",
    "SECTION_8_COMPANY", "COOPERATIVE", "NGO", "TRUST", "OTHER"
  ]).optional(),
  designation: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  twitterUrl: z.string().url().optional(),
  experience: z.number().int().min(0).max(50).optional(),
  skills: z.array(z.string().max(50)).optional(),
  certifications: z.array(z.string().max(100)).optional(),
  languages: z.array(z.string().max(30)).optional(),
  membershipType: z.enum(["BASIC", "PREMIUM", "PROFESSIONAL", "ENTERPRISE"]).default("BASIC"),
  profileVisibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS_ONLY", "BUSINESS_ONLY"]).default("PUBLIC"),
  showEmail: z.boolean().default(false),
  showPhone: z.boolean().default(false),
});

// User Address Schema
export const userAddressSchema = z.object({
  street: z.string().max(200).optional(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// KYC Schema
export const kycSchema = z.object({
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format").optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits").optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format").optional(),
  panDocument: z.string().url().optional(),
  aadhaarDocument: z.string().url().optional(),
  gstDocument: z.string().url().optional(),
  addressProof: z.string().url().optional(),
});

// User Preferences Schema
export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  interestedCategories: z.array(z.string().max(50)).optional(),
  preferredLocations: z.array(z.string().max(100)).optional(),
  budgetRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string().default("INR")
  }).optional(),
  allowProfileViews: z.boolean().default(true),
  allowDirectContact: z.boolean().default(true),
  showOnlineStatus: z.boolean().default(true),
  preferredLanguage: z.string().default("en"),
  timezone: z.string().optional(),
});

// Inquiry Schema
export const inquirySchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
  inquiryType: z.enum([
    "GENERAL", "PRODUCT", "SERVICE", "PARTNERSHIP",
    "INVESTMENT", "SUPPORT", "COMPLAINT"
  ]).default("GENERAL"),
  category: z.string().max(100).optional(),
  contactName: z.string().min(1, "Contact name is required").max(100),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().optional(),
  referenceId: z.string().optional(),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
});

// Order Schema
export const orderSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, "At least one item is required"),
});

// User Activity Schema
export const userActivitySchema = z.object({
  activity: z.enum([
    "LOGIN", "LOGOUT", "PROFILE_UPDATE", "KYC_SUBMISSION",
    "ORDER_PLACED", "INQUIRY_SENT", "DOCUMENT_UPLOAD",
    "PASSWORD_CHANGE", "EMAIL_CHANGE", "PHONE_VERIFICATION",
    "SUBSCRIPTION_CHANGE", "PREFERENCE_UPDATE"
  ]),
  description: z.string().max(500).optional(),
  entityType: z.string().max(50).optional(),
  entityId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Update Schemas
export const updateUserProfileSchema = userProfileSchema.partial();
export const updateUserAddressSchema = userAddressSchema.partial();
export const updateUserPreferencesSchema = userPreferencesSchema.partial();

// Types
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>;
export type UserAddressInput = z.infer<typeof userAddressSchema>;
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>;
export type KYCInput = z.infer<typeof kycSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type UserActivityInput = z.infer<typeof userActivitySchema>;