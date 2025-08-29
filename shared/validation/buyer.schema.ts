import { z } from "zod";

// Buyer Registration Schema
export const buyerRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  company: z.string().max(200).optional(),
  budget: z.number().positive().optional(),
  interests: z.array(z.string().max(100)).optional(),
  location: z.string().max(200).optional(),
});

// Buyer Message Schema
export const buyerMessageSchema = z.object({
  content: z.string().min(1, "Message content is required").max(2000),
  messageType: z.enum(["GENERAL", "INQUIRY", "SUPPORT", "NOTIFICATION"]).default("GENERAL"),
});

// Buyer Recommendation Schema
export const buyerRecommendationSchema = z.object({
  listingId: z.string().cuid().optional(),
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required").max(1000),
  score: z.number().min(0).max(5).optional(),
});

// Buyer Inquiry Schema
export const buyerInquirySchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  sellerId: z.string().cuid("Invalid seller ID"),
  message: z.string().min(1, "Message is required").max(2000),
  status: z.enum(["PENDING", "RESPONDED", "CLOSED", "CANCELLED"]).default("PENDING"),
});

// Buyer Order Schema
export const buyerOrderSchema = z.object({
  sellerId: z.string().cuid("Invalid seller ID"),
  listingId: z.string().cuid("Invalid listing ID"),
  amount: z.number().positive("Amount must be positive"),
  quantity: z.number().int().positive("Quantity must be positive").default(1),
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]).default("PENDING"),
});

// Buyer Search Schema
export const buyerSearchSchema = z.object({
  query: z.string().min(1, "Search query is required").max(200),
  category: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  sortBy: z.enum(["relevance", "price_low", "price_high", "rating", "newest"]).default("relevance"),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(20),
});

// Buyer Filter Schema
export const buyerFilterSchema = z.object({
  categories: z.array(z.string()).optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  location: z.string().max(100).optional(),
  rating: z.number().min(1).max(5).optional(),
  availability: z.boolean().optional(),
  verified: z.boolean().optional(),
});

// Buyer Preferences Schema
export const buyerPreferencesSchema = z.object({
  budget: z.number().positive().optional(),
  interests: z.array(z.string().max(100)).optional(),
  location: z.string().max(200).optional(),
  preferredCategories: z.array(z.string().max(100)).optional(),
  notificationPreferences: z.object({
    email: z.boolean().default(true),
    sms: z.boolean().default(false),
    push: z.boolean().default(true),
  }).optional(),
});

// Update Schemas
export const updateBuyerSchema = buyerRegistrationSchema.partial();
export const updateBuyerPreferencesSchema = buyerPreferencesSchema.partial();

// Pro Upgrade Schema
export const proUpgradeSchema = z.object({
  plan: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  paymentMethod: z.enum(["CARD", "UPI", "NETBANKING", "WALLET"]),
});

// Types
export type BuyerRegistrationInput = z.infer<typeof buyerRegistrationSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
export type BuyerMessageInput = z.infer<typeof buyerMessageSchema>;
export type BuyerRecommendationInput = z.infer<typeof buyerRecommendationSchema>;
export type BuyerInquiryInput = z.infer<typeof buyerInquirySchema>;
export type BuyerOrderInput = z.infer<typeof buyerOrderSchema>;
export type BuyerSearchInput = z.infer<typeof buyerSearchSchema>;
export type BuyerFilterInput = z.infer<typeof buyerFilterSchema>;
export type BuyerPreferencesInput = z.infer<typeof buyerPreferencesSchema>;
export type UpdateBuyerPreferencesInput = z.infer<typeof updateBuyerPreferencesSchema>;
export type ProUpgradeInput = z.infer<typeof proUpgradeSchema>;