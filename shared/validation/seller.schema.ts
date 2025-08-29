import { z } from "zod";

// Seller Registration Schema
export const sellerRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  businessName: z.string().max(200).optional(),
  businessType: z.enum(["INDIVIDUAL", "BUSINESS", "MANUFACTURER", "DISTRIBUTOR", "WHOLESALER", "RETAILER"]).default("INDIVIDUAL"),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format").optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format").optional(),
  businessAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string().regex(/^\d{6}$/),
    country: z.string().default("India"),
  }).optional(),
  website: z.string().url().optional(),
});

// Listing Creation Schema
export const listingCreationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  category: z.string().min(1, "Category is required").max(100),
  subcategory: z.string().max(100).optional(),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("INR"),
  priceType: z.enum(["FIXED", "NEGOTIABLE", "QUOTE_BASED", "AUCTION"]).default("FIXED"),
  minOrderQty: z.number().int().positive().optional(),
  specifications: z.record(z.any()).optional(),
  features: z.array(z.string().max(200)).optional(),
  tags: z.array(z.string().max(50)).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  isInStock: z.boolean().default(true),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
});

// Inquiry Response Schema
export const inquiryResponseSchema = z.object({
  inquiryId: z.string().cuid("Invalid inquiry ID"),
  response: z.string().min(1, "Response is required").max(2000),
  status: z.enum(["NEW", "IN_PROGRESS", "RESPONDED", "CONVERTED", "CLOSED", "SPAM"]).default("RESPONDED"),
});

// Seller Order Schema
export const sellerOrderSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  buyerId: z.string().cuid("Invalid buyer ID"),
  quantity: z.number().int().positive("Quantity must be positive").default(1),
  unitPrice: z.number().positive("Unit price must be positive"),
  totalAmount: z.number().positive("Total amount must be positive"),
  status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "COMPLETED", "CANCELLED", "REFUNDED"]).default("PENDING"),
  deliveryDate: z.date().optional(),
});

// Seller Review Schema
export const sellerReviewSchema = z.object({
  sellerId: z.string().cuid("Invalid seller ID"),
  reviewerId: z.string().cuid("Invalid reviewer ID"),
  orderId: z.string().cuid().optional(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(1, "Comment is required").max(1000),
  qualityRating: z.number().int().min(1).max(5).optional(),
  serviceRating: z.number().int().min(1).max(5).optional(),
  deliveryRating: z.number().int().min(1).max(5).optional(),
});

// Seller Subscription Schema
export const sellerSubscriptionSchema = z.object({
  plan: z.enum(["BASIC", "PREMIUM", "PROFESSIONAL", "ENTERPRISE"]),
  billingCycle: z.enum(["MONTHLY", "QUARTERLY", "YEARLY"]),
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("INR"),
  featuresEnabled: z.array(z.string()).optional(),
  maxListings: z.number().int().positive().optional(),
});

// Seller Analytics Schema
export const sellerAnalyticsSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  metrics: z.array(z.enum(["views", "inquiries", "orders", "revenue", "rating"])).default(["views", "inquiries", "orders"]),
  groupBy: z.enum(["day", "week", "month"]).default("day"),
});

// Seller Performance Schema
export const sellerPerformanceSchema = z.object({
  period: z.enum(["week", "month", "quarter", "year"]).default("month"),
  includeComparisons: z.boolean().default(true),
});

// Update Schemas
export const updateSellerSchema = sellerRegistrationSchema.partial();
export const updateListingSchema = listingCreationSchema.partial();

// Bulk Operations Schema
export const bulkListingUpdateSchema = z.object({
  listingIds: z.array(z.string().cuid()).min(1, "At least one listing ID is required"),
  updates: z.object({
    status: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "SUSPENDED", "REJECTED", "EXPIRED"]).optional(),
    isActive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  }),
});

// Types
export type SellerRegistrationInput = z.infer<typeof sellerRegistrationSchema>;
export type UpdateSellerInput = z.infer<typeof updateSellerSchema>;
export type ListingCreationInput = z.infer<typeof listingCreationSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type InquiryResponseInput = z.infer<typeof inquiryResponseSchema>;
export type SellerOrderInput = z.infer<typeof sellerOrderSchema>;
export type SellerReviewInput = z.infer<typeof sellerReviewSchema>;
export type SellerSubscriptionInput = z.infer<typeof sellerSubscriptionSchema>;
export type SellerAnalyticsInput = z.infer<typeof sellerAnalyticsSchema>;
export type SellerPerformanceInput = z.infer<typeof sellerPerformanceSchema>;
export type BulkListingUpdateInput = z.infer<typeof bulkListingUpdateSchema>;