import { z } from "zod";

// Admin Registration Schema
export const adminRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must contain uppercase, lowercase, number and special character"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR"]).default("ADMIN"),
  permissions: z.array(z.string()).optional(),
});

// User Management Schema
export const userManagementSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  action: z.enum(["ACTIVATE", "SUSPEND", "BAN", "DELETE", "VERIFY"]),
  reason: z.string().min(1, "Reason is required").max(500),
  duration: z.number().int().positive().optional(), // Duration in days for temporary actions
});

// Audit Log Schema
export const auditLogSchema = z.object({
  adminId: z.string().cuid("Invalid admin ID"),
  action: z.string().min(1, "Action is required").max(100),
  entityType: z.string().max(50).optional(),
  entityId: z.string().optional(),
  description: z.string().min(1, "Description is required").max(1000),
  beforeData: z.record(z.any()).optional(),
  afterData: z.record(z.any()).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  requestId: z.string().optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
});

// Admin Query Schema
export const adminQuerySchema = z.object({
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR"]).optional(),
  isActive: z.boolean().optional(),
  search: z.string().max(100).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "email", "role", "createdAt", "lastLoginAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// Update Admin Schema
export const updateAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "MODERATOR"]).optional(),
  permissions: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

// Change Password Schema
export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, "Password must contain uppercase, lowercase, number and special character"),
});

// Bulk User Action Schema
export const bulkUserActionSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1, "At least one user ID is required"),
  action: z.enum(["ACTIVATE", "SUSPEND", "BAN", "DELETE", "VERIFY"]),
  reason: z.string().min(1, "Reason is required").max(500),
  duration: z.number().int().positive().optional(),
});

// System Settings Schema
export const systemSettingsSchema = z.object({
  category: z.enum(["SYSTEM", "SECURITY", "PAYMENT", "NOTIFICATION", "BUSINESS", "COMPLIANCE", "FEATURE"]),
  settings: z.record(z.any()),
});

// Types
export type AdminRegistrationInput = z.infer<typeof adminRegistrationSchema>;
export type UserManagementInput = z.infer<typeof userManagementSchema>;
export type AuditLogInput = z.infer<typeof auditLogSchema>;
export type AdminQueryInput = z.infer<typeof adminQuerySchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type AdminChangePasswordInput = z.infer<typeof adminChangePasswordSchema>;
export type BulkUserActionInput = z.infer<typeof bulkUserActionSchema>;
export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>;