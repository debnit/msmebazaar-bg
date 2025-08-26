import { PaymentService } from '../services/payment.service';
import { SessionUser } from '@shared/types/user';
import { UserRole } from '@shared/types/feature';
import { PaymentStatus, Currency } from '@prisma/client';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    payment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    $transaction: jest.fn(),
    $queryRaw: jest.fn(),
  })),
  Prisma: {
    Decimal: jest.fn((value) => ({ toNumber: () => value })),
  },
}));

// Mock Razorpay client
jest.mock('../services/razorpayClient', () => ({
  orders: {
    create: jest.fn(),
  },
  utils: {
    verifyPaymentSignature: jest.fn(),
  },
}));

describe('PaymentService', () => {
  const mockUser: SessionUser = {
    id: 'user-123',
    email: 'buyer@example.com',
    name: 'Test Buyer',
    isPro: false,
    roles: [UserRole.BUYER],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockProUser: SessionUser = {
    ...mockUser,
    isPro: true,
    onboardedProAt: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRazorpayOrder', () => {
    it('should create payment order for Buyer', async () => {
      const mockPayment = {
        id: 'payment-123',
        userId: 'user-123',
        orderId: 'order-123',
        amount: { toNumber: () => 1000 },
        currency: Currency.INR,
        status: PaymentStatus.PENDING,
        razorpayOrderId: 'rzp_order_123',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockRazorpayOrder = {
        id: 'rzp_order_123',
        amount: 100000,
        currency: 'INR',
        receipt: 'receipt_123'
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        return callback({
          payment: {
            create: jest.fn().mockResolvedValue(mockPayment),
            update: jest.fn().mockResolvedValue(mockPayment)
          }
        });
      });

      const razorpayClient = require('../services/razorpayClient');
      razorpayClient.orders.create.mockResolvedValue(mockRazorpayOrder);

      const result = await PaymentService.createRazorpayOrder(mockUser, {
        userId: 'user-123',
        amount: 1000,
        currency: Currency.INR
      });

      expect(result.success).toBe(true);
      expect(result.data.paymentRecord.id).toBe('payment-123');
    });

    it('should return error for non-Buyer/Seller', async () => {
      const msmeUser = { ...mockUser, roles: [UserRole.MSME_OWNER] };

      await expect(PaymentService.createRazorpayOrder(msmeUser, {
        userId: 'user-123',
        amount: 1000
      })).rejects.toThrow('Only Buyers and Sellers can create payment orders');
    });

    it('should validate amount limits', async () => {
      await expect(PaymentService.createRazorpayOrder(mockUser, {
        userId: 'user-123',
        amount: 1000000 // Exceeds MAX_AMOUNT
      })).rejects.toThrow('Amount must be between ₹1 and ₹500000');
    });
  });

  describe('verifyPayment', () => {
    it('should verify payment successfully', async () => {
      const mockPayment = {
        id: 'payment-123',
        userId: 'user-123',
        amount: { toNumber: () => 1000 },
        status: PaymentStatus.COMPLETED,
        razorpayPaymentId: 'rzp_payment_123',
        paidAt: new Date(),
        updatedAt: new Date()
      };

      const razorpayClient = require('../services/razorpayClient');
      razorpayClient.utils.verifyPaymentSignature.mockReturnValue(true);

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.update.mockResolvedValue(mockPayment);

      const result = await PaymentService.verifyPayment(
        mockUser,
        'rzp_order_123',
        'rzp_payment_123',
        'signature_123'
      );

      expect(result.success).toBe(true);
      expect(result.data.payment.status).toBe(PaymentStatus.COMPLETED);
    });

    it('should return error for invalid signature', async () => {
      const razorpayClient = require('../services/razorpayClient');
      razorpayClient.utils.verifyPaymentSignature.mockReturnValue(false);

      await expect(PaymentService.verifyPayment(
        mockUser,
        'rzp_order_123',
        'rzp_payment_123',
        'invalid_signature'
      )).rejects.toThrow('Invalid payment signature');
    });
  });

  describe('getPaymentHistory', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await PaymentService.getPaymentHistory(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return payment history for Pro users', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          orderId: 'order-1',
          amount: { toNumber: () => 1000 },
          currency: Currency.INR,
          status: PaymentStatus.COMPLETED,
          method: 'CARD',
          description: 'Test payment',
          createdAt: new Date(),
          paidAt: new Date()
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await PaymentService.getPaymentHistory(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.payments).toHaveLength(1);
    });
  });

  describe('getBasicPaymentHistory', () => {
    it('should return basic payment history for all users', async () => {
      const mockPayments = [
        {
          id: 'payment-1',
          amount: { toNumber: () => 1000 },
          currency: Currency.INR,
          status: PaymentStatus.COMPLETED,
          createdAt: new Date()
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.findMany.mockResolvedValue(mockPayments);

      const result = await PaymentService.getBasicPaymentHistory(mockUser);

      expect(result.success).toBe(true);
      expect(result.data.payments).toHaveLength(1);
    });
  });

  describe('getPaymentAnalytics', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await PaymentService.getPaymentAnalytics(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return payment analytics for Pro users', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.count.mockResolvedValue(10);
      mockPrisma.payment.aggregate.mockResolvedValue({
        _sum: { amount: { toNumber: () => 10000 } },
        _avg: { amount: { toNumber: () => 1000 } }
      });
      mockPrisma.payment.groupBy.mockResolvedValue([
        { method: 'CARD', _count: { method: 5 }, _sum: { amount: { toNumber: () => 5000 } } }
      ]);
      mockPrisma.$queryRaw.mockResolvedValue([
        { month: '2024-01', count: 5, amount: { toNumber: () => 5000 } }
      ]);

      const result = await PaymentService.getPaymentAnalytics(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.analytics.totalPayments).toBe(10);
      expect(result.data.analytics.totalAmount).toBe(10000);
    });
  });

  describe('getPaymentDetails', () => {
    it('should return payment details', async () => {
      const mockPayment = {
        id: 'payment-123',
        orderId: 'order-123',
        amount: { toNumber: () => 1000 },
        currency: Currency.INR,
        status: PaymentStatus.COMPLETED,
        method: 'CARD',
        description: 'Test payment',
        metadata: {},
        razorpayOrderId: 'rzp_order_123',
        razorpayPaymentId: 'rzp_payment_123',
        createdAt: new Date(),
        paidAt: new Date(),
        updatedAt: new Date()
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.findFirst.mockResolvedValue(mockPayment);

      const result = await PaymentService.getPaymentDetails(mockUser, 'payment-123');

      expect(result.success).toBe(true);
      expect(result.data.payment.id).toBe('payment-123');
    });

    it('should return error for non-existent payment', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.payment.findFirst.mockResolvedValue(null);

      const result = await PaymentService.getPaymentDetails(mockUser, 'payment-123');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Payment not found');
    });
  });

  describe('getPaymentMethods', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await PaymentService.getPaymentMethods(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return payment methods for Pro users', async () => {
      const result = await PaymentService.getPaymentMethods(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.paymentMethods).toHaveLength(4); // All methods including wallet
    });
  });
});
