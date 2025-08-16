import { z } from "zod";

export const searchRequestSchema = z.object({
  userId: z.string().uuid(),
  query: z.string().min(3)
});
