import { z } from "zod";

export const adminCreateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string()
});
