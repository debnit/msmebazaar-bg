import { z } from "zod";

export const matchmakingRequestSchema = z.object({
  buyerId: z.string().uuid(),
  sellerId: z.string().uuid(),
  score: z.number().min(0).max(1).optional()
});
