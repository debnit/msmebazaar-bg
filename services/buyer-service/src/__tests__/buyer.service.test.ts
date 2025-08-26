import { BuyerService } from '../services/buyer.service';
import { SessionUser } from '@shared/types/user';
import { UserRole } from '@shared/types/feature';

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    buyer: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    msmeListing: {
      findMany: jest.fn(),
    },
    message: {
      count: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    savedSearch: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    searchLog: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  })),
}));

describe('BuyerService', () => {
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

  describe('getBuyerProfile', () => {
    it('should return buyer profile for valid user', async () => {
      const mockBuyer = {
        id: 'buyer-123',
        userId: 'user-123',
        companyName: 'Test Company',
        industry: 'Technology',
        location: 'Mumbai',
        contactInfo: { phone: '1234567890' },
        preferences: { categories: ['tech'] },
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          name: 'Test Buyer',
          email: 'buyer@example.com',
          isPro: false
        }
      };

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.buyer.findUnique.mockResolvedValue(mockBuyer);

      const result = await BuyerService.getBuyerProfile(mockUser);

      expect(result.success).toBe(true);
      expect(result.data.profile.id).toBe('buyer-123');
    });

    it('should return error for user without buyer role', async () => {
      const userWithoutRole = { ...mockUser, roles: [UserRole.SELLER] };

      await expect(BuyerService.getBuyerProfile(userWithoutRole))
        .rejects.toThrow('User does not have buyer role');
    });
  });

  describe('basicSearch', () => {
    it('should perform basic search for buyers', async () => {
      const mockResults = [
        {
          id: 'listing-1',
          title: 'Test Listing',
          description: 'Test Description',
          price: 1000,
          category: 'Technology',
          location: 'Mumbai',
          images: ['image1.jpg'],
          createdAt: new Date(),
          seller: {
            id: 'seller-1',
            name: 'Test Seller',
            rating: 4.5,
            verified: true
          }
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.msmeListing.findMany.mockResolvedValue(mockResults);

      const result = await BuyerService.basicSearch(mockUser, 'test', 20);

      expect(result.success).toBe(true);
      expect(result.data.results).toHaveLength(1);
      expect(result.data.query).toBe('test');
    });
  });

  describe('advancedSearch', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await BuyerService.advancedSearch(mockUser, 'test', {});

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should perform advanced search for Pro users', async () => {
      const mockResults = [
        {
          id: 'listing-1',
          title: 'Test Listing',
          description: 'Test Description',
          price: 1000,
          category: 'Technology',
          location: 'Mumbai',
          images: ['image1.jpg'],
          createdAt: new Date(),
          seller: {
            id: 'seller-1',
            name: 'Test Seller',
            rating: 4.5,
            verified: true,
            industry: 'Technology',
            location: 'Mumbai'
          }
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.msmeListing.findMany.mockResolvedValue(mockResults);

      const result = await BuyerService.advancedSearch(mockProUser, 'test', {});

      expect(result.success).toBe(true);
      expect(result.data.results).toHaveLength(1);
    });
  });

  describe('contactSeller', () => {
    it('should allow Pro users to send unlimited messages', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.message.count.mockResolvedValue(0);
      mockPrisma.message.create.mockResolvedValue({
        id: 'msg-1',
        createdAt: new Date()
      });

      const result = await BuyerService.contactSeller(mockProUser, 'seller-1', 'Hello');

      expect(result.success).toBe(true);
    });

    it('should limit free users to 5 messages per day', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.message.count.mockResolvedValue(5);

      const result = await BuyerService.contactSeller(mockUser, 'seller-1', 'Hello');

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });
  });

  describe('getSavedSearches', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await BuyerService.getSavedSearches(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return saved searches for Pro users', async () => {
      const mockSearches = [
        {
          id: 'search-1',
          name: 'Tech Companies',
          query: 'technology',
          filters: { category: ['tech'] },
          createdAt: new Date()
        }
      ];

      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.savedSearch.findMany.mockResolvedValue(mockSearches);

      const result = await BuyerService.getSavedSearches(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.searches).toHaveLength(1);
    });
  });

  describe('getBuyerAnalytics', () => {
    it('should return upgrade required for non-Pro users', async () => {
      const result = await BuyerService.getBuyerAnalytics(mockUser);

      expect(result.success).toBe(false);
      expect(result.data.upgradeRequired).toBe(true);
    });

    it('should return analytics for Pro users', async () => {
      const { PrismaClient } = require('@prisma/client');
      const mockPrisma = new PrismaClient();
      mockPrisma.searchLog.count.mockResolvedValue(10);
      mockPrisma.message.count.mockResolvedValue(5);
      mockPrisma.searchLog.groupBy.mockResolvedValue([
        { category: 'Technology', _count: { category: 5 } }
      ]);

      const result = await BuyerService.getBuyerAnalytics(mockProUser);

      expect(result.success).toBe(true);
      expect(result.data.analytics.totalSearches).toBe(10);
      expect(result.data.analytics.totalMessages).toBe(5);
    });
  });
});
