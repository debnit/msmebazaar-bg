// ENHANCED PRODUCTION CONTROLLER
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { PaymentService } from "../services/payment.service";
import { logger } from "../utils/logger";
import { ValidationError, NotFoundError } from "../utils/errors";

export class PaymentController {
  static async createRazorpayOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { amount, orderId, description, metadata } = req.body;
      const userId = req.user!.id;

      const result = await PaymentService.createRazorpayOrder({
        userId,
        orderId,
        amount,
        description,
        metadata,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
      });

      logger.info('Payment order created', {
        paymentId: result.paymentRecord.id,
        userId,
        amount,
      });

      res.status(201).json({
        success: true,
        data: {
          payment: {
            id: result.paymentRecord.id,
            amount: result.paymentRecord.amount,
            currency: result.paymentRecord.currency,
            status: result.paymentRecord.status,
          },
          razorpay: {
            order_id: result.razorpayOrder.id,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,
            key: env.razorpay.keyId, // Frontend needs this
          },
        },
      });
    } catch (error) {
      PaymentController.handleError(error, res, 'createRazorpayOrder');
    }
  }

  static async verifyPayment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const payment = await PaymentService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          payment_id: payment.id,
          status: payment.status,
          amount: payment.amount,
        },
      });
    } catch (error) {
      PaymentController.handleError(error, res, 'verifyPayment');
    }
  }

  static async razorpayWebhook(req: Request, res: Response): Promise<void> {
    try {
      // Enhanced webhook validation
      const signature = req.headers['x-razorpay-signature'] as string;
      const body = req.body;

      if (!signature) {
        logger.warn('Webhook received without signature', { ip: req.ip });
           res.status(400).json({ error: 'Missing signature' });
      }

      // Validate signature
      const isValid = razorpayClient.utils.verifyWebhookSignature(
        JSON.stringify(body),
        signature,
        env.razorpay.webhookSecret
      );

      if (!isValid) {
        logger.warn('Invalid webhook signature', { 
          ip: req.ip,
          signature: signature.slice(0, 20) + '...', // Log partial signature for debugging
        });
           res.status(400).json({ error: 'Invalid signature' });
      }

      const event = body.event;
      const payload = body.payload;

      logger.info('Webhook received', { event, entity: payload?.payment?.entity?.id });

      switch (event) {
        case 'payment.captured':
          await PaymentController.handlePaymentCaptured(payload);
          break;
        case 'payment.failed':
          await PaymentController.handlePaymentFailed(payload);
          break;
        case 'refund.processed':
          await PaymentController.handleRefundProcessed(payload);
          break;
        default:
          logger.info('Unhandled webhook event', { event });
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      logger.error('Webhook processing failed', {
        error: error.message,
        event: req.body?.event,
      });
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  private static async handlePaymentCaptured(payload: any): Promise<void> {
    const paymentEntity = payload.payment.entity;
    await PaymentService.updatePaymentStatus(
      paymentEntity.order_id,
      PaymentStatus.COMPLETED,
      paymentEntity.id
    );
  }

  private static handleError(error: any, res: Response, operation: string): void {
    logger.error(`${operation} failed`, {
      error: error.message,
      stack: error.stack,
    });

    if (error instanceof ValidationError) {
        res.status(400).json({
        success: false,
        error: error.message,
        code: 'VALIDATION_ERROR',
      });
    }

    if (error instanceof NotFoundError) {
        res.status(404).json({
        success: false,
        error: error.message,
        code: 'NOT_FOUND',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}
