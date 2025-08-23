// CTO RECOMMENDATION - Production-grade service implementation
import { Prisma } from "@prisma/client";
import { logger } from "../utils/logger";
import { publishEvent } from "../kafka/producer";

export interface CreateOrderRequest {
  userId: string;
  orderId?: string;
  amount: number; // in rupees
  currency: Currency;
  description?: string;
  metadata?: Record<string, any>;
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
  private static readonly MAX_AMOUNT = 500000; // ₹5 Lakh limit
  private static readonly MIN_AMOUNT = 1; // ₹1 minimum

  static async createRazorpayOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const { userId, orderId, amount, currency = Currency.INR, description, metadata } = request;

    // Input validation with business rules
    if (amount < this.MIN_AMOUNT || amount > this.MAX_AMOUNT) {
      throw new ValidationError(`Amount must be between ₹${this.MIN_AMOUNT} and ₹${this.MAX_AMOUNT}`);
    }

    const receipt = `order_${orderId || Date.now()}_${userId.slice(-6)}`;
    const amountInPaise = Math.round(amount * 100);

    try {
      // Create database transaction for consistency
      const result = await prisma.$transaction(async (tx) => {
        // Create payment record first
        const paymentRecord = await tx.payment.create({
          data: {
            userId,
            orderId,
            amount: new Prisma.Decimal(amount),
            currency,
            status: PaymentStatus.PENDING,
            metadata: metadata || {},
            ipAddress: request.ipAddress,
            userAgent: request.userAgent,
          },
        });

        // Create Razorpay order
        const razorpayOptions = {
          amount: amountInPaise,
          currency: currency,
          receipt,
          payment_capture: 1, // Auto capture
          notes: {
            payment_id: paymentRecord.id,
            user_id: userId,
            order_id: orderId,
          },
        };

        const order = await razorpayClient.orders.create(razorpayOptions);

        // Update payment record with Razorpay order ID
        const updatedPayment = await tx.payment.update({
          where: { id: paymentRecord.id },
          data: { 
            razorpayOrderId: order.id,
            gatewayResponse: order as any,
          },
        });

        return { paymentRecord: updatedPayment, razorpayOrder: order };
      });

      // Publish event for analytics and notifications
      await publishEvent('payment.order.created', {
        paymentId: result.paymentRecord.id,
        userId,
        amount,
        currency,
        razorpayOrderId: result.razorpayOrder.id,
      });

      logger.info('Payment order created successfully', {
        paymentId: result.paymentRecord.id,
        userId,
        amount,
        razorpayOrderId: result.razorpayOrder.id,
      });

      return result;
    } catch (error) {
      logger.error('Failed to create payment order', {
        userId,
        amount,
        error: error.message,
        stack: error.stack,
      });

      if (error.code === 'P2002') {
        throw new ConflictError('Duplicate payment order detected');
      }

      if (error.error?.code === 'BAD_REQUEST_ERROR') {
        throw new ValidationError(`Razorpay error: ${error.error.description}`);
      }

      throw new InternalServerError('Failed to create payment order');
    }
  }

  static async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<Payment> {
    try {
      // Verify signature using Razorpay SDK
      const isValid = razorpayClient.utils.verifyPaymentSignature({
        order_id: razorpayOrderId,
        payment_id: razorpayPaymentId,
        signature: razorpaySignature,
      });

      if (!isValid) {
        throw new ValidationError('Invalid payment signature');
      }

      // Update payment status
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

      // Publish success event
      await publishEvent('payment.completed', {
        paymentId: payment.id,
        userId: payment.userId,
        amount: payment.amount.toNumber(),
        razorpayPaymentId,
      });

      return payment;
    } catch (error) {
      logger.error('Payment verification failed', {
        razorpayOrderId,
        razorpayPaymentId,
        error: error.message,
      });
      throw error;
    }
  }

  static async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
    gatewayPaymentId?: string
  ): Promise<Payment> {
    try {
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (status === PaymentStatus.COMPLETED) {
        updateData.paidAt = new Date();
      } else if (status === PaymentStatus.FAILED) {
        updateData.failedAt = new Date();
      }

      if (gatewayPaymentId) {
        updateData.razorpayPaymentId = gatewayPaymentId;
      }

      const payment = await prisma.payment.update({
        where: { razorpayOrderId: orderId },
        data: updateData,
      });

      // Publish status change event
      await publishEvent('payment.status.updated', {
        paymentId: payment.id,
        previousStatus: payment.status,
        newStatus: status,
        userId: payment.userId,
      });

      return payment;
    } catch (error) {
      logger.error('Failed to update payment status', {
        orderId,
        status,
        error: error.message,
      });
      throw error;
    }
  }
}
