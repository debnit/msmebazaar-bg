// /shared/validation/payments.schema.ts
import { z } from "zod";

export const createPaymentOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default("INR"),
  planId: z.string().optional() // for subscription upgrades
});

export const verifyPaymentSchema = z.object({
  razorpayPaymentId: z.string(),
  razorpayOrderId: z.string(),
  razorpaySignature: z.string()
});

export type CreatePaymentOrderInput = z.infer<typeof createPaymentOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
