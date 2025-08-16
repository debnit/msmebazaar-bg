import { z } from "zod";

export const buyerSchema = z.object({
  userId: z.string().uuid(),
  preference: z.record(z.any())
});
