import { z } from "zod";

export const createPaymentSchema = z.object({
  orderId: z.string().optional(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  metadata: z.record(z.any()).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

export const updatePaymentStatusSchema = z.object({
  status: z.enum(["initiated", "pending", "completed", "failed", "refunded", "cancelled"]),
  gatewayRef: z.string().optional(),
});
