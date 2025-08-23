import { z } from "zod";

// Reuse enums as needed
export const CurrencyEnum = z.enum(["INR", "USD", "EUR"]);
export const PaymentStatusEnum = z.enum([
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
]);
export const PaymentMethodEnum = z.enum(["CARD", "UPI", "NETBANKING", "WALLET"]);

export const CreateOrderRequestSchema = z.object({
  userId: z.string().uuid(),
  orderId: z.string().optional(),
  amount: z.number().min(1).max(500000),
  currency: CurrencyEnum,
  description: z.string().max(256).optional(),
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(512).optional(),
});

export const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export const UpdatePaymentStatusSchema = z.object({
  orderId: z.string().min(1),
  status: PaymentStatusEnum,
  gatewayPaymentId: z.string().optional(),
});
