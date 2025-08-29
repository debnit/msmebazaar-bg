import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { getSessionUser } from '@msmebazaar/shared/auth';
import { PaymentStatus } from '@prisma/client';
import { logger } from '../utils/logger';

export const createPaymentOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { orderId, amount, currency, description, metadata } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const result = await PaymentService.createRazorpayOrder(user, {
      userId: user.id,
      orderId,
      amount,
      currency,
      description,
      metadata,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error('Create payment order controller error', { error });
    next(error);
  }
};

export const verifyPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ 
        error: 'razorpayOrderId, razorpayPaymentId, and razorpaySignature are required' 
      });
    }

    const result = await PaymentService.verifyPayment(
      user,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    res.json(result);
  } catch (error) {
    logger.error('Verify payment controller error', { error });
    next(error);
  }
};

export const getPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { limit = 50 } = req.query;

    const result = await PaymentService.getPaymentHistory(user, Number(limit));

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get payment history controller error', { error });
    next(error);
  }
};

export const getBasicPaymentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { limit = 10 } = req.query;

    const result = await PaymentService.getBasicPaymentHistory(user, Number(limit));

    res.json(result);
  } catch (error) {
    logger.error('Get basic payment history controller error', { error });
    next(error);
  }
};

export const getPaymentAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await PaymentService.getPaymentAnalytics(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get payment analytics controller error', { error });
    next(error);
  }
};

export const getPaymentDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ error: 'Payment ID is required' });
    }

    const result = await PaymentService.getPaymentDetails(user, paymentId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get payment details controller error', { error });
    next(error);
  }
};

export const updatePaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { orderId } = req.params;
    const { status, gatewayPaymentId } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ error: 'Order ID and status are required' });
    }

    // Validate status
    if (!Object.values(PaymentStatus).includes(status)) {
      return res.status(400).json({ error: 'Invalid payment status' });
    }

    const result = await PaymentService.updatePaymentStatus(
      user,
      orderId,
      status as PaymentStatus,
      gatewayPaymentId
    );

    res.json(result);
  } catch (error) {
    logger.error('Update payment status controller error', { error });
    next(error);
  }
};

export const getPaymentMethods = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await PaymentService.getPaymentMethods(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get payment methods controller error', { error });
    next(error);
  }
};

