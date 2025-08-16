import { z } from "zod";

export const recommendationRequestSchema = z.object({
  filters: z.record(z.any()).optional(),
  limit: z.number().int().min(1).max(20).optional()
});
