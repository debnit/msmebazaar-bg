import { z } from "zod";

export const transactionMatchSchema = z.object({
  transaction1: z.string().uuid(),
  transaction2: z.string().uuid(),
  score: z.number().min(0).max(1)
});
