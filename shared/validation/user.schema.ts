import { z } from "zod";

// Profile update
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  address: z.string().optional(),
  socialLinks: z.record(z.string().url()).optional(), // e.g., {linkedin: "..."}
});

// User preference update (if you support it)
export const updatePreferencesSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  notifications: z.boolean().optional(),
  // extend as needed
});

// User basic info fetch (for request param validation)
export const userIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
