// services/payment-service/src/services/payment.service.ts

import { Currency, Payment, PaymentStatus, Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { publishEvents } from "../kafka/producer";
import prisma from "../db/prismaClient";
import { ValidationError, ConflictError, InternalServerError } from "../utils/errors";
import razorpayClient from "./razorpayClient";

export interface CreateOrderRequest {
  userId: string;
  orderId?: string;
  amount: number;
  currency: Currency;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateOrderResponse {
  paymentRecord: Payment;
  razorpayOrder: {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };
}

export class PaymentService {
  private static readonly MAX_AMOUNT = 500_000; // ₹5 Lakh limit
  private static readonly MIN_AMOUNT = 1;       // ₹1 minimum

  static async createRazorpayOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const { userId, orderId, amount, currency = Currency.INR, metadata } = request;

    if (amount < this.MIN_AMOUNT || amount > this.MAX_AMOUNT) {
      throw new ValidationError(`Amount must be between ₹${this.MIN_AMOUNT} and ₹${this.MAX_AMOUNT}`);
    }

    const receipt = `order_${orderId || Date.now()}_${userId.slice(-6)}`;
    const amountInPaise = Math.round(amount * 100);

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Provide merchantId with valid value or "" if nullable in schema
        const paymentRecord = await tx.payment.create({
          data: {
            userId,
            orderId,
            merchantId: "", // <-- Adjust if your schema requires a real value
            method: "CARD", // <-- Default or real payment method
            amount: new Prisma.Decimal(amount),
            currency,
            status: PaymentStatus.PENDING,
            metadata: metadata || {},
            ipAddress: request.ipAddress,
            userAgent: request.userAgent,
          },
        });

        // Cast razorpayOptions to any if types don't align with your razorpay SDK version 
        const razorpayOptions = {
          amount: amountInPaise,
          currency,
          receipt,
          payment_capture: 1,
          notes: {
            payment_id: paymentRecord.id,
            user_id: userId,
            order_id: orderId,
          },
        } as any;

        const order = await razorpayClient.orders.create(razorpayOptions);

        const updatedPayment = await tx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            razorpayOrderId: order.id,
            gatewayResponse: order as any,
          },
        });

        return { paymentRecord: updatedPayment, razorpayOrder: order };
      });

      await publishEvents.orderCreated(
        result.paymentRecord.id,
        request.userId,
        {
          amount,
          currency,
          razorpayOrderId: result.razorpayOrder.id,
        }
      );

      logger.info("Payment order created successfully", {
        paymentId: result.paymentRecord.id,
        userId,
        amount,
        razorpayOrderId: result.razorpayOrder.id,
      });

      return {
        paymentRecord: result.paymentRecord,
        razorpayOrder: {
          id: result.razorpayOrder.id,
          amount: result.razorpayOrder.amount,
          currency: result.razorpayOrder.currency,
          receipt: result.razorpayOrder.receipt,
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Failed to create payment order", {
          userId,
          amount,
          message: error.message,
          stack: error.stack,
        });

        const anyErr = error as any;
        if (anyErr.code === "P2002") {
          throw new ConflictError("Duplicate payment order detected");
        }
        if (anyErr.error?.code === "BAD_REQUEST_ERROR") {
          throw new ValidationError(`Razorpay error: ${anyErr.error.description}`);
        }
      } else {
        logger.error("Unknown error during payment order creation", { userId, amount, error });
      }
      throw new InternalServerError("Failed to create payment order");
    }
  }

  static async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<Payment> {
    try {
      // Cast razorpayClient as any to access utils if typings missing
      const isValid = (razorpayClient as any).utils.verifyPaymentSignature({
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isValid) throw new ValidationError("Invalid payment signature");

      const payment = await prisma.payment.update({
        where: { razorpayOrderId },
        data: {
          status: PaymentStatus.COMPLETED,
          razorpayPaymentId,
          paidAt: new Date(),
          gatewayResponse: {
            payment_id: razorpayPaymentId,
            signature: razorpaySignature,
          },
        },
      });

      await publishEvents.paymentCompleted(
        payment.id,
        payment.userId,
        {
          amount: payment.amount.toNumber(),
          razorpayPaymentId,
        }
      );

      return payment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Payment verification failed", {
          razorpayOrderId,
          razorpayPaymentId,
          message: error.message,
          stack: error.stack,
        });
      } else {
        logger.error("Unknown error verifying payment", { razorpayOrderId, razorpayPaymentId, error });
      }
      throw error;
    }
  }

  static async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    gatewayPaymentId?: string
  ): Promise<Payment> {
    try {
      const existingPayment = await prisma.payment.findUnique({
        where: { razorpayOrderId: orderId },
      });

      if (!existingPayment) {
        throw new ValidationError(`Payment with orderId ${orderId} not found`);
      }

      const updateData: Partial<Payment> = {
        status,
        updatedAt: new Date(),
      };

      if (status === PaymentStatus.COMPLETED) updateData.paidAt = new Date();
      if (status === PaymentStatus.FAILED) updateData.failedAt = new Date();
      if (gatewayPaymentId) updateData.razorpayPaymentId = gatewayPaymentId;

      const payment = await prisma.payment.update({
        where: { razorpayOrderId: orderId },
        data: updateData,
      });

      await publishEvents.paymentStatusUpdated(
        payment.id,
        payment.userId,
        {
          previousStatus: existingPayment.status,
          newStatus: status,
        }
      );

      return payment;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Failed to update payment status", {
          orderId,
          status,
          message: error.message,
          stack: error.stack,
        });
      } else {
        logger.error("Unknown error updating payment status", { orderId, status, error });
      }
      throw error;
    }
  }
}
