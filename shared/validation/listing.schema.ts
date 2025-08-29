import { z } from "zod";

// Listing Creation Schema  
export const listingCreationSchema = z.object({
  msmeId: z.string().cuid("Invalid MSME ID"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  category: z.string().min(1, "Category is required").max(100),
  subcategory: z.string().max(100).optional(),
  tags: z.array(z.string().max(50)).optional(),
  businessType: z.enum(["MICRO", "SMALL", "MEDIUM", "STARTUP"]),
  establishedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  employeeCount: z.number().int().min(0).optional(),
  products: z.record(z.any()).optional(),
  services: z.record(z.any()).optional(),
  certifications: z.array(z.string().max(200)).optional(),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.record(z.any()),
  website: z.string().url().optional(),
  visibility: z.enum(["PRIVATE", "PUBLIC", "MEMBERS_ONLY"]).default("PRIVATE"),
  isPremium: z.boolean().default(false),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
  slug: z.string().max(200).optional(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  documents: z.array(z.string().url()).optional(),
});

// Listing Inquiry Schema
export const listingInquirySchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().max(200).optional(),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(2000),
  inquiryType: z.enum(["GENERAL", "QUOTATION", "PARTNERSHIP", "INVESTMENT", "PROCUREMENT"]).default("GENERAL"),
});

// Listing Review Schema
export const listingReviewSchema = z.object({
  listingId: z.string().cuid("Invalid listing ID"),
  reviewerId: z.string().cuid("Invalid reviewer ID"),
  reviewerName: z.string().min(1, "Reviewer name is required").max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().min(1, "Comment is required").max(1000),
  isVerified: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).optional(),
  parentId: z.string().cuid().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

// Update Schemas
export const updateListingSchema = listingCreationSchema.partial();
export const updateCategorySchema = categorySchema.partial();

// Listing Query Schema
export const listingQuerySchema = z.object({
  category: z.string().optional(),
  businessType: z.enum(["MICRO", "SMALL", "MEDIUM", "STARTUP"]).optional(),
  location: z.string().optional(),
  search: z.string().max(200).optional(),
  status: z.enum(["DRAFT", "PENDING_REVIEW", "APPROVED", "PUBLISHED", "SUSPENDED", "REJECTED", "ARCHIVED"]).optional(),
  isPremium: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "updatedAt", "viewCount", "inquiryCount", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Types
export type ListingCreationInput = z.infer<typeof listingCreationSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
export type ListingInquiryInput = z.infer<typeof listingInquirySchema>;
export type ListingReviewInput = z.infer<typeof listingReviewSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type ListingQueryInput = z.infer<typeof listingQuerySchema>;