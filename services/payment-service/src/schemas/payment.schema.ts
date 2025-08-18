import { z } from "zod";
export const createPaymentSchema = z.object({
  orderId: z.string(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  metadata: z.record(z.any()).optional(),
});
