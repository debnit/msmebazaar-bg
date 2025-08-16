import { z } from "zod";

export const paymentSchema = z.object({
  userId: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.string(),
  amount: z.number().positive(),
  currency: z.string().min(3).max(3)
});
