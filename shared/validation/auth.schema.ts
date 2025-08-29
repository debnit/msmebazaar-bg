import { z } from "zod";

// User Login
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// User Registration
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
});

// Password Reset Request
export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Password Reset Confirmation
export const resetPasswordConfirmSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

// Token Refresh
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// Change Password
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

// Email Verification
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// Two Factor Authentication
export const enableTwoFactorSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const verifyTwoFactorSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

// Role Assignment
export const assignRoleSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  roleId: z.string().cuid("Invalid role ID"),
});

// Profile Creation
export const createProfileSchema = z.object({
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  socialLinks: z.record(z.string().url()).optional(),
});

// Session Management
export const createSessionSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordConfirmInput = z.infer<typeof resetPasswordConfirmSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type EnableTwoFactorInput = z.infer<typeof enableTwoFactorSchema>;
export type VerifyTwoFactorInput = z.infer<typeof verifyTwoFactorSchema>;
export type AssignRoleInput = z.infer<typeof assignRoleSchema>;
export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
