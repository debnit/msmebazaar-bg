import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

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

const initiateRefundSchema = z.object({
  paymentId: z.string().cuid(),
  amount: z.number().min(1),
  reason: z.string().optional(),
});

const getRefundStatusSchema = z.object({
  refundId: z.string().cuid(),
});

const getTransactionsSchema = z.object({
  userId: z.string().optional(),
  fromDate: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date().optional()),
  toDate: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date().optional()),
});

const getAnalyticsSchema = z.object({});

const schemas: Record<string, ZodSchema> = {
  createOrder: CreateOrderRequestSchema,
  verifyPayment: VerifyPaymentSchema,
  getPaymentStatus: UpdatePaymentStatusSchema,
  initiateRefund: initiateRefundSchema,
  getRefundStatus: getRefundStatusSchema,
  getTransactions: getTransactionsSchema,
  getAnalytics: getAnalyticsSchema,
};

/**
 * Middleware factory to validate request body or params with given Zod schema
 */
export function validateRequest(schemaKey: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const schema = schemas[schemaKey];
    if (!schema) {
      return next(new Error(`No validation schema found for key: ${schemaKey}`));
    }

    // Validate GET requests on params, else body
    const dataToValidate = req.method === "GET" ? req.params : req.body;

    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const errors = result.error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        res.status(400).json({
        success: false,
        error: "Validation error",
        message: errors,
        code: "VALIDATION_ERROR",
      });
      return;
    }

    // Replace request data with parsed data
    if (req.method === "GET") {
      req.params = result.data;
    } else {
      req.body = result.data;
    }

    next();
  };
}