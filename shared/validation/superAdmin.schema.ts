import { z } from "zod";

export const superAdminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
  role: z.literal("super_admin")
});
