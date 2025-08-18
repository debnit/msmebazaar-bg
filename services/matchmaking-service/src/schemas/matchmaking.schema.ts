import { z } from "zod";
import { msmeSchema } from "../../../shared/validation/msme.schema";

export const matchmakingCreateSchema = z.object({
  msmeId: z.string().uuid(),
  matchedEntityId: z.string().uuid(),
  score: z.number().min(0).max(1),
  createdAt: z.string().optional(),
});

export const matchmakingRequestSchema = z.object({
  msmeId: z.string().uuid(),
});
