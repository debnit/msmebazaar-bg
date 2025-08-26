import { LoanService } from '../services/loan.service';
import { SessionUser } from '@shared/types/user';
import { UserRole } from '@shared/types/feature';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    loanApplication: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    businessProfile: {
      findUnique: jest.fn(),
    },
  })),
}));

describe('LoanService', () => {
  const mockUser: SessionUser = {
    id: 'user-123',
    email: 'msme@example.com',
    name: 'Test MSME Owner',
    isPro: false,
    roles: [UserRole.MSME_OWNER],
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

  describe('createLoanApplication', () => {
    it('should create loan application for MSME Owner', async () => {
      const mockApplication = {
        id: 'loan-123',
        userId: 'user-123',
        loanAmount: 100000,
        purpose: 'Business Expansion',
        tenureMonths: 24,
        businessType: 'Manufacturing',
        annualRevenue: 500000,
        creditScore: 750,
        status: 'DRAFT',
        priorityLevel: 'NORMAL',
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.create.mockResolvedValue(mockApplication);

      const result = await LoanService.createLoanApplication(mockUser, {
        loanAmount: 100000,
        purpose: 'Business Expansion',
        tenureMonths: 24,
        businessType: 'Manufacturing',
        annualRevenue: 500000,
        creditScore: 750
      });

      expect(result.success).toBe(true);
      expect(result.data.application.id).toBe('loan-123');
      expect(result.data.application.priorityLevel).toBe('NORMAL');
    });

    it('should create priority application for Pro users', async () => {
      const mockApplication = {
        id: 'loan-123',
        userId: 'user-123',
        loanAmount: 100000,
        purpose: 'Business Expansion',
        tenureMonths: 24,
        businessType: 'Manufacturing',
        annualRevenue: 500000,
        creditScore: 750,
        status: 'DRAFT',
        priorityLevel: 'PRIORITY',
        documents: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.create.mockResolvedValue(mockApplication);

      const result = await LoanService.createLoanApplication(mockProUser, {
        loanAmount: 100000,
        purpose: 'Business Expansion',
        tenureMonths: 24,
        businessType: 'Manufacturing',
        annualRevenue: 500000
      });

      expect(result.success).toBe(true);
      expect(result.data.application.priorityLevel).toBe('PRIORITY');
    });

    it('should return error for non-MSME Owner', async () => {
      const buyerUser = { ...mockUser, roles: [UserRole.BUYER] };

      await expect(LoanService.createLoanApplication(buyerUser, {}))
        .rejects.toThrow('Only MSME Owners can apply for loans');
    });
  });

  describe('submitLoanApplication', () => {
    it('should submit loan application successfully', async () => {
      const mockApplication = {
        id: 'loan-123',
        userId: 'user-123',
        status: 'DRAFT'
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.findFirst.mockResolvedValue(mockApplication);
      mockPrisma.loanApplication.update.mockResolvedValue({
        ...mockApplication,
        status: 'SUBMITTED'
      });

      const result = await LoanService.submitLoanApplication(mockUser, 'loan-123');

      expect(result.success).toBe(true);
      expect(result.data.application.status).toBe('SUBMITTED');
    });

    it('should return error for non-existent application', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.findFirst.mockResolvedValue(null);

      const result = await LoanService.submitLoanApplication(mockUser, 'loan-123');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Loan application not found');
    });
  });

  describe('getLoanOffers', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await LoanService.getLoanOffers(mockUser, 'loan-123');

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return loan offers for Pro users', async () => {
      const mockApplication = {
        id: 'loan-123',
        userId: 'user-123',
        loanAmount: 100000,
        tenureMonths: 24,
        creditScore: 750
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.findFirst.mockResolvedValue(mockApplication);

      const result = await LoanService.getLoanOffers(mockProUser, 'loan-123');

      expect(result.success).toBe(true);
      expect(result.data.offers).toHaveLength(1);
    });
  });

  describe('getBusinessValuation', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await LoanService.getBusinessValuation(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return business valuation for Pro users', async () => {
      const mockBusinessProfile = {
        userId: 'user-123',
        annualRevenue: 500000,
        businessAge: 5
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.businessProfile.findUnique.mockResolvedValue(mockBusinessProfile);

      const result = await LoanService.getBusinessValuation(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.valuation.businessValue).toBeGreaterThan(0);
    });
  });

  describe('getUserLoanApplications', () => {
    it('should return user loan applications', async () => {
      const mockApplications = [
        {
          id: 'loan-1',
          loanAmount: 100000,
          purpose: 'Business Expansion',
          tenureMonths: 24,
          businessType: 'Manufacturing',
          status: 'SUBMITTED',
          priorityLevel: 'NORMAL',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.loanApplication.findMany.mockResolvedValue(mockApplications);

      const result = await LoanService.getUserLoanApplications(mockUser);

      expect(result.success).toBe(true);
      expect(result.data.applications).toHaveLength(1);
    });
  });

  describe('calculateLoanEligibility', () => {
    it('should calculate loan eligibility', async () => {
      const mockBusinessProfile = {
        userId: 'user-123',
        annualRevenue: 500000,
        businessAge: 5,
        creditScore: 750
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.businessProfile.findUnique.mockResolvedValue(mockBusinessProfile);

      const result = await LoanService.calculateLoanEligibility(mockUser, 100000, 24);

      expect(result.success).toBe(true);
      expect(result.data.eligibility.score).toBeGreaterThan(0);
      expect(result.data.eligibility.isEligible).toBeDefined();
    });
  });
});
