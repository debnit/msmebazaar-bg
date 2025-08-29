import { z } from "zod";

// MSME Registration Schema
export const msmeRegistrationSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters").max(200),
  legalName: z.string().max(200).optional(),
  gstNumber: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Invalid GST number format").optional(),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format").optional(),
  cinNumber: z.string().optional(),
  udyamNumber: z.string().optional(),
  businessType: z.enum(["MICRO", "SMALL", "MEDIUM", "STARTUP"]),
  category: z.enum([
    "MANUFACTURING", "TRADING", "SERVICE", "AGRICULTURE", "TECHNOLOGY",
    "HEALTHCARE", "EDUCATION", "CONSTRUCTION", "TEXTILE", "FOOD_PROCESSING",
    "AUTOMOTIVE", "CHEMICALS", "ELECTRONICS", "RENEWABLE_ENERGY", "OTHER"
  ]),
  subcategory: z.string().max(100).optional(),
  establishedDate: z.date().optional(),
  incorporationDate: z.date().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url().optional(),
  annualTurnover: z.number().positive().optional(),
  employeeCount: z.number().int().min(0).optional(),
  exportTurnover: z.number().positive().optional(),
});

// Business Address Schema
export const businessAddressSchema = z.object({
  street: z.string().min(1, "Street is required").max(200),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be 6 digits"),
  country: z.string().default("India"),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// MSME Document Schema
export const msmeDocumentSchema = z.object({
  documentType: z.enum([
    "UDYAM_REGISTRATION", "GST_CERTIFICATE", "PAN_CARD", 
    "INCORPORATION_CERTIFICATE", "MOA_AOA", "BANK_STATEMENT",
    "ITR", "FINANCIAL_STATEMENT", "LICENSE_PERMIT", "OTHER"
  ]),
  documentName: z.string().min(1, "Document name is required").max(200),
  documentUrl: z.string().url("Invalid document URL"),
  documentNumber: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
});

// MSME Profile Schema
export const msmeProfileSchema = z.object({
  description: z.string().max(2000).optional(),
  mission: z.string().max(500).optional(),
  vision: z.string().max(500).optional(),
  products: z.array(z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
  })).optional(),
  services: z.array(z.object({
    name: z.string(),
    description: z.string(),
    category: z.string(),
  })).optional(),
  certifications: z.array(z.string().max(200)).optional(),
  awards: z.array(z.string().max(200)).optional(),
  targetMarkets: z.array(z.string().max(100)).optional(),
  clientTypes: z.array(z.string().max(100)).optional(),
  productionCapacity: z.string().max(500).optional(),
  qualityStandards: z.array(z.string().max(100)).optional(),
  logo: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  videos: z.array(z.string().url()).optional(),
  brochures: z.array(z.string().url()).optional(),
});

// Update Schemas
export const updateMsmeSchema = msmeRegistrationSchema.partial();
export const updateBusinessAddressSchema = businessAddressSchema.partial();
export const updateMsmeProfileSchema = msmeProfileSchema.partial();

// Validation Schemas
export const msmeIdSchema = z.object({
  msmeId: z.string().cuid("Invalid MSME ID"),
});

export const verificationRequestSchema = z.object({
  msmeId: z.string().cuid("Invalid MSME ID"),
  documents: z.array(z.string().cuid()).min(1, "At least one document is required"),
});

// Types
export type MSMERegistrationInput = z.infer<typeof msmeRegistrationSchema>;
export type UpdateMSMEInput = z.infer<typeof updateMsmeSchema>;
export type BusinessAddressInput = z.infer<typeof businessAddressSchema>;
export type UpdateBusinessAddressInput = z.infer<typeof updateBusinessAddressSchema>;
export type MSMEDocumentInput = z.infer<typeof msmeDocumentSchema>;
export type MSMEProfileInput = z.infer<typeof msmeProfileSchema>;
export type UpdateMSMEProfileInput = z.infer<typeof updateMsmeProfileSchema>;
export type MSMEIdInput = z.infer<typeof msmeIdSchema>;
export type VerificationRequestInput = z.infer<typeof verificationRequestSchema>;