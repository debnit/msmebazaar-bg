// CTO RECOMMENDATION - Production-grade helper utilities
import { Request } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { Prisma } from "@prisma/client";
import crypto from "crypto";
import { logger } from "./logger";

export class PaymentHelpers {
  /**
   * Extract User ID with proper type safety and validation
   */
  static getUserIdFromReq(req: AuthenticatedRequest): string {
    const userId = req.user?.id;
    
    if (!userId) {
      logger.error('Attempted to extract user ID from unauthenticated request', {
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
      throw new Error('User authentication required');
    }

    // Validate UUID format for security
    if (!this.isValidUUID(userId)) {
      logger.error('Invalid user ID format detected', {
        userId: userId.slice(0, 8) + '...',
        path: req.path,
      });
      throw new Error('Invalid user ID format');
    }

    return userId;
  }

  /**
   * Sanitize payment data with type safety and validation
   */
  static cleanPaymentData<T extends Record<string, any>>(
    data: T,
    allowedFields?: string[]
  ): Partial<T> {
    const cleaned: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      // Skip null/undefined values
      if (value === undefined || value === null) return;
      
      // If allowedFields specified, only include those
      if (allowedFields && !allowedFields.includes(key)) return;

      // Sanitize string values
      if (typeof value === 'string') {
        cleaned[key] = this.sanitizeString(value);
      }
      // Handle numbers
      else if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
        cleaned[key] = value;
      }
      // Handle booleans
      else if (typeof value === 'boolean') {
        cleaned[key] = value;
      }
      // Handle objects (but not Date objects)
      else if (typeof value === 'object' && !(value instanceof Date)) {
        cleaned[key] = this.cleanPaymentData(value, allowedFields);
      }
      // Handle dates
      else if (value instanceof Date) {
        cleaned[key] = value;
      }
    });

    return cleaned as Partial<T>;
  }

  /**
   * Format currency with proper decimal handling and validation
   */
  static formatCurrencyAmount(
    amount: number | Prisma.Decimal,
    currency: string = 'INR',
    locale: string = 'en-IN'
  ): string {
    const numericAmount = typeof amount === 'number' 
      ? amount 
      : parseFloat(amount.toString());

    if (!isFinite(numericAmount) || numericAmount < 0) {
      throw new Error('Invalid currency amount');
    }

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  }

  /**
   * Convert amount to smallest currency unit (paise for INR)
   */
  static toSmallestCurrencyUnit(amount: number, currency: string = 'INR'): number {
    const multipliers: Record<string, number> = {
      INR: 100,
      USD: 100,
      EUR: 100,
      GBP: 100,
    };

    const multiplier = multipliers[currency] || 100;
    return Math.round(amount * multiplier);
  }

  /**
   * Convert from smallest currency unit to main unit
   */
  static fromSmallestCurrencyUnit(amount: number, currency: string = 'INR'): number {
    const multipliers: Record<string, number> = {
      INR: 100,
      USD: 100,
      EUR: 100,
      GBP: 100,
    };

    const multiplier = multipliers[currency] || 100;
    return amount / multiplier;
  }

  /**
   * Generate secure receipt ID
   */
  static generateReceiptId(prefix: string = 'rcpt'): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(4).toString('hex');
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Sanitize string inputs to prevent XSS
   */
  private static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Generate payment signature for verification
   */
  static generatePaymentSignature(
    orderId: string,
    paymentId: string,
    secret: string
  ): string {
    const message = `${orderId}|${paymentId}`;
    return crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');
  }

  /**
   * Verify payment signature
   */
  static verifyPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generatePaymentSignature(orderId, paymentId, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Extract client IP from request with proxy support
   */
  static getClientIP(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'] as string;
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (realIp) {
      return realIp;
    }
    
    return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
  }
}

// Export individual functions for backward compatibility
export const getUserIdFromReq = PaymentHelpers.getUserIdFromReq;
export const cleanPaymentData = PaymentHelpers.cleanPaymentData;
export const formatCurrencyAmount = PaymentHelpers.formatCurrencyAmount;
