import { z } from "zod";

// Payment Creation Schema
export const createPaymentSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  orderId: z.string().optional(),
  merchantId: z.string().optional(),
  amount: z.number().positive("Amount must be positive"),
  currency: z.enum(["INR", "USD", "EUR"]).default("INR"),
  method: z.enum(["CARD", "UPI", "NETBANKING", "WALLET"]),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

// Payment Update Schema
export const updatePaymentSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"]),
  razorpayPaymentId: z.string().optional(),
  gatewayRef: z.string().optional(),
  gatewayResponse: z.record(z.any()).optional(),
  failureReason: z.string().optional(),
});

// Refund Schema
export const refundSchema = z.object({
  paymentId: z.string().cuid("Invalid payment ID"),
  amount: z.number().positive("Refund amount must be positive"),
  reason: z.string().min(1, "Refund reason is required").max(500),
  initiatedBy: z.string().cuid("Invalid user ID"),
});

// Webhook Event Schema
export const webhookEventSchema = z.object({
  paymentId: z.string().cuid("Invalid payment ID"),
  eventType: z.string().min(1, "Event type is required"),
  eventData: z.record(z.any()),
  signature: z.string().min(1, "Signature is required"),
});

// Payment Query Schema
export const paymentQuerySchema = z.object({
  userId: z.string().cuid().optional(),
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED", "REFUNDED", "CANCELLED"]).optional(),
  method: z.enum(["CARD", "UPI", "NETBANKING", "WALLET"]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Razorpay Order Schema
export const razorpayOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  receipt: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

// Card Payment Schema
export const cardPaymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
});

// UPI Payment Schema
export const upiPaymentSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, "Invalid UPI ID format"),
});

// Net Banking Schema
export const netBankingSchema = z.object({
  bankCode: z.string().min(1, "Bank code is required"),
});

// Wallet Payment Schema
export const walletPaymentSchema = z.object({
  walletProvider: z.enum(["PAYTM", "PHONEPE", "GPAY", "AMAZONPAY"]),
  walletNumber: z.string().optional(),
});

// Payment Analytics Schema
export const paymentAnalyticsSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  groupBy: z.enum(["day", "week", "month", "year"]).default("day"),
  metrics: z.array(z.enum(["count", "amount", "success_rate", "method_breakdown"])).default(["count", "amount"]),
});

// Types
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type RefundInput = z.infer<typeof refundSchema>;
export type WebhookEventInput = z.infer<typeof webhookEventSchema>;
export type PaymentQueryInput = z.infer<typeof paymentQuerySchema>;
export type RazorpayOrderInput = z.infer<typeof razorpayOrderSchema>;
export type CardPaymentInput = z.infer<typeof cardPaymentSchema>;
export type UPIPaymentInput = z.infer<typeof upiPaymentSchema>;
export type NetBankingInput = z.infer<typeof netBankingSchema>;
export type WalletPaymentInput = z.infer<typeof walletPaymentSchema>;
export type PaymentAnalyticsInput = z.infer<typeof paymentAnalyticsSchema>;