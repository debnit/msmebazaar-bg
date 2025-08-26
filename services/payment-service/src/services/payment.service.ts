// services/payment-service/src/services/payment.service.ts

import { Currency, Payment, PaymentStatus, Prisma } from "@prisma/client";
import { SessionUser } from '@shared/types/user';
import { FeatureGatingService } from '@shared/services/featureGating.service';
import { Feature } from '@shared/types/feature';
import { UserRole } from '@shared/types/feature';
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

export interface PaymentHistory {
  id: string;
  orderId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: string;
  description?: string;
  createdAt: string;
  paidAt?: string;
}

export interface PaymentAnalytics {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  averageAmount: number;
  monthlyTrends: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
  }>;
}

export interface PaymentServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class PaymentService {
  private static readonly MAX_AMOUNT = 500_000; // ₹5 Lakh limit
  private static readonly MIN_AMOUNT = 1;       // ₹1 minimum

  /**
   * Create Razorpay order (available to Buyers and Sellers)
   */
  static async createRazorpayOrder(user: SessionUser, request: CreateOrderRequest): Promise<PaymentServiceResponse> {
    try {
      // Check if user has buyer or seller role
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can create payment orders');
      }

      const { userId, orderId, amount, currency = Currency.INR, metadata } = request;

      if (amount < this.MIN_AMOUNT || amount > this.MAX_AMOUNT) {
        throw new ValidationError(`Amount must be between ₹${this.MIN_AMOUNT} and ₹${this.MAX_AMOUNT}`);
      }

      const receipt = `order_${orderId || Date.now()}_${userId.slice(-6)}`;
      const amountInPaise = Math.round(amount * 100);

      const result = await prisma.$transaction(async (tx) => {
        const paymentRecord = await tx.payment.create({
          data: {
            userId,
            orderId,
            merchantId: "",
            method: "CARD",
            amount: new Prisma.Decimal(amount),
            currency,
            status: PaymentStatus.PENDING,
            metadata: metadata || {},
            ipAddress: request.ipAddress,
            userAgent: request.userAgent,
          },
        });

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
        isPro: user.isPro
      });

      return {
        success: true,
        message: 'Payment order created successfully',
        data: {
          paymentRecord: result.paymentRecord,
          razorpayOrder: {
            id: result.razorpayOrder.id,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,
            receipt: result.razorpayOrder.receipt,
          }
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Failed to create payment order", {
          userId: request.userId,
          amount: request.amount,
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
        logger.error("Unknown error during payment order creation", { userId: request.userId, amount: request.amount, error });
      }
      throw new InternalServerError("Failed to create payment order");
    }
  }

  /**
   * Verify payment signature and complete payment
   */
  static async verifyPayment(
    user: SessionUser,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can verify payments');
      }

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

      return {
        success: true,
        message: 'Payment verified and completed successfully',
        data: { payment }
      };
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

  /**
   * Get payment history (Pro feature for advanced history)
   */
  static async getPaymentHistory(user: SessionUser, limit: number = 50): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can view payment history');
      }

      // Check Pro access for advanced payment history
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.PAYMENT_HISTORY);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Advanced payment history requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      const payments = await prisma.payment.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return {
        success: true,
        message: 'Payment history retrieved successfully',
        data: {
          payments: payments.map(payment => ({
            id: payment.id,
            orderId: payment.orderId,
            amount: payment.amount.toNumber(),
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            description: payment.description,
            createdAt: payment.createdAt.toISOString(),
            paidAt: payment.paidAt?.toISOString()
          })),
          total: payments.length
        }
      };
    } catch (error) {
      logger.error('Get payment history failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get basic payment history (available to all users)
   */
  static async getBasicPaymentHistory(user: SessionUser, limit: number = 10): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can view payment history');
      }

      const payments = await prisma.payment.findMany({
        where: { 
          userId: user.id,
          status: PaymentStatus.COMPLETED
        },
        orderBy: { createdAt: 'desc' },
        take: limit
      });

      return {
        success: true,
        message: 'Basic payment history retrieved successfully',
        data: {
          payments: payments.map(payment => ({
            id: payment.id,
            amount: payment.amount.toNumber(),
            currency: payment.currency,
            status: payment.status,
            createdAt: payment.createdAt.toISOString()
          })),
          total: payments.length
        }
      };
    } catch (error) {
      logger.error('Get basic payment history failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get payment analytics (Pro feature)
   */
  static async getPaymentAnalytics(user: SessionUser): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can view payment analytics');
      }

      // Check Pro access for analytics
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.ADVANCED_ANALYTICS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Payment analytics requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Get analytics data
      const totalPayments = await prisma.payment.count({
        where: { userId: user.id }
      });

      const successfulPayments = await prisma.payment.count({
        where: { 
          userId: user.id,
          status: PaymentStatus.COMPLETED
        }
      });

      const failedPayments = await prisma.payment.count({
        where: { 
          userId: user.id,
          status: PaymentStatus.FAILED
        }
      });

      const totalAmount = await prisma.payment.aggregate({
        where: { 
          userId: user.id,
          status: PaymentStatus.COMPLETED
        },
        _sum: { amount: true }
      });

      const averageAmount = await prisma.payment.aggregate({
        where: { 
          userId: user.id,
          status: PaymentStatus.COMPLETED
        },
        _avg: { amount: true }
      });

      // Get monthly trends (last 6 months)
      const monthlyTrends = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*) as count,
          SUM(amount) as amount
        FROM "Payment"
        WHERE "userId" = ${user.id}
        AND "status" = 'COMPLETED'
        AND "createdAt" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
      `;

      // Get payment methods breakdown
      const paymentMethods = await prisma.payment.groupBy({
        by: ['method'],
        where: { 
          userId: user.id,
          status: PaymentStatus.COMPLETED
        },
        _count: { method: true },
        _sum: { amount: true }
      });

      return {
        success: true,
        message: 'Payment analytics retrieved successfully',
        data: {
          analytics: {
            totalPayments,
            totalAmount: totalAmount._sum.amount?.toNumber() || 0,
            successfulPayments,
            failedPayments,
            averageAmount: averageAmount._avg.amount?.toNumber() || 0,
            monthlyTrends: monthlyTrends.map((trend: any) => ({
              month: trend.month,
              amount: trend.amount.toNumber(),
              count: Number(trend.count)
            })),
            paymentMethods: paymentMethods.map(method => ({
              method: method.method,
              count: method._count.method,
              amount: method._sum.amount?.toNumber() || 0
            }))
          }
        }
      };
    } catch (error) {
      logger.error('Get payment analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get payment details
   */
  static async getPaymentDetails(user: SessionUser, paymentId: string): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can view payment details');
      }

      const payment = await prisma.payment.findFirst({
        where: { 
          id: paymentId,
          userId: user.id
        }
      });

      if (!payment) {
        return {
          success: false,
          message: 'Payment not found'
        };
      }

      return {
        success: true,
        message: 'Payment details retrieved successfully',
        data: {
          payment: {
            id: payment.id,
            orderId: payment.orderId,
            amount: payment.amount.toNumber(),
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            description: payment.description,
            metadata: payment.metadata,
            razorpayOrderId: payment.razorpayOrderId,
            razorpayPaymentId: payment.razorpayPaymentId,
            createdAt: payment.createdAt.toISOString(),
            paidAt: payment.paidAt?.toISOString(),
            updatedAt: payment.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get payment details failed', { error, userId: user.id, paymentId });
      throw error;
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    user: SessionUser,
    orderId: string,
    status: PaymentStatus,
    gatewayPaymentId?: string
  ): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can update payment status');
      }

      const existingPayment = await prisma.payment.findFirst({
        where: { 
          razorpayOrderId: orderId,
          userId: user.id
        }
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

      return {
        success: true,
        message: 'Payment status updated successfully',
        data: { payment }
      };
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

  /**
   * Get payment methods (Pro feature)
   */
  static async getPaymentMethods(user: SessionUser): Promise<PaymentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.BUYER) && !user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Buyers and Sellers can view payment methods');
      }

      // Check Pro access for payment methods
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.PAYMENTS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Payment methods require Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock payment methods - in real scenario, this would fetch from payment gateway
      const paymentMethods = [
        {
          id: 'card',
          name: 'Credit/Debit Card',
          type: 'card',
          enabled: true
        },
        {
          id: 'upi',
          name: 'UPI',
          type: 'upi',
          enabled: true
        },
        {
          id: 'netbanking',
          name: 'Net Banking',
          type: 'netbanking',
          enabled: true
        },
        {
          id: 'wallet',
          name: 'Digital Wallet',
          type: 'wallet',
          enabled: user.isPro // Only Pro users get wallet option
        }
      ];

      return {
        success: true,
        message: 'Payment methods retrieved successfully',
        data: {
          paymentMethods: paymentMethods.filter(method => method.enabled)
        }
      };
    } catch (error) {
      logger.error('Get payment methods failed', { error, userId: user.id });
      throw error;
    }
  }
}
