import { z } from "zod";

export const mlJobEventSchema = z.object({
  id: z.string().uuid(),
  service: z.string(),
  status: z.string(), // e.g. "completed", "failed"
  metrics: z.record(z.any()),
  startedAt: z.string().optional(),
  endedAt: z.string().optional()
});
