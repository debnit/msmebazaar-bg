import * as z from "zod";

export const updateUserProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  bio: z.string().max(500).optional(),
});

export type UpdateUserProfileForm = z.infer<typeof updateUserProfileSchema>;
