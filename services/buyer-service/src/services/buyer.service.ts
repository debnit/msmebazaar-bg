import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@msmebazaar/types/user';
import { FeatureGatingService } from '@msmebazaar/shared/services/featureGating.service';
import { Feature } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface BuyerProfile {
  id: string;
  userId: string;
  companyName?: string;
  industry?: string;
  location?: string;
  contactInfo?: {
    phone?: string;
    website?: string;
    address?: string;
  };
  preferences?: {
    categories: string[];
    budgetRange?: {
      min: number;
      max: number;
    };
    location?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  category?: string[];
  location?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  industry?: string[];
  rating?: number;
  verified?: boolean;
}

export interface BuyerServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class BuyerService {
  static async getBuyerProfile(user: SessionUser): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const buyer = await prisma.buyer.findUnique({
        where: { userId: user.id },
        include: { user: { select: { name: true, email: true, isPro: true } } }
      });
      if (!buyer) return { success: false, message: 'Buyer profile not found' };
      return {
        success: true,
        message: 'Buyer profile retrieved successfully',
        data: {
          profile: {
            id: buyer.id,
            userId: buyer.userId,
            companyName: buyer.companyName,
            industry: buyer.industry,
            location: buyer.location,
            contactInfo: buyer.contactInfo,
            preferences: buyer.preferences,
            createdAt: buyer.createdAt.toISOString(),
            updatedAt: buyer.updatedAt.toISOString()
          },
          user: buyer.user
        }
      };
    } catch (error) {
      logger.error('Get buyer profile failed', { error, userId: user.id });
      throw error;
    }
  }

  static async updateBuyerProfile(user: SessionUser, profileData: Partial<BuyerProfile>): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const updatedBuyer = await prisma.buyer.upsert({
        where: { userId: user.id },
        update: profileData,
        create: { userId: user.id, ...profileData }
      });
      return {
        success: true,
        message: 'Buyer profile updated successfully',
        data: {
          profile: {
            id: updatedBuyer.id,
            userId: updatedBuyer.userId,
            companyName: updatedBuyer.companyName,
            industry: updatedBuyer.industry,
            location: updatedBuyer.location,
            contactInfo: updatedBuyer.contactInfo,
            preferences: updatedBuyer.preferences,
            createdAt: updatedBuyer.createdAt.toISOString(),
            updatedAt: updatedBuyer.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Update buyer profile failed', { error, userId: user.id });
      throw error;
    }
  }

  // Listings
  static async browseListings(user: SessionUser, limit = 20): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const listings = await prisma.msmeListing.findMany({
        where: { status: 'ACTIVE' },
        include: { seller: { select: { id: true, name: true, rating: true, verified: true } } },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      return {
        success: true,
        message: 'Listings retrieved successfully',
        data: {
          results: listings.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            location: item.location,
            seller: item.seller,
            images: item.images,
            createdAt: item.createdAt.toISOString()
          })),
          total: listings.length
        }
      };
    } catch (error) {
      logger.error('Browse listings failed', { error, userId: user.id });
      throw error;
    }
  }

  static async getListingDetails(user: SessionUser, id: string): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const item = await prisma.msmeListing.findUnique({
        where: { id },
        include: { seller: { select: { id: true, name: true, rating: true, verified: true } } }
      });
      if (!item) return { success: false, message: 'Listing not found' };
      return {
        success: true,
        message: 'Listing details retrieved successfully',
        data: {
          listing: {
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            location: item.location,
            seller: item.seller,
            images: item.images,
            createdAt: item.createdAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get listing details failed', { error, userId: user.id, id });
      throw error;
    }
  }

  // Search
  static async basicSearch(user: SessionUser, query: string, limit = 20): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const results = await prisma.msmeListing.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { category: { contains: query, mode: 'insensitive' } }
          ],
          status: 'ACTIVE'
        },
        include: { seller: { select: { id: true, name: true, rating: true, verified: true } } },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      return {
        success: true,
        message: 'Search completed successfully',
        data: {
          results: results.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            location: item.location,
            seller: item.seller,
            images: item.images,
            createdAt: item.createdAt.toISOString()
          })),
          total: results.length,
          query
        }
      };
    } catch (error) {
      logger.error('Basic search failed', { error, userId: user.id, query });
      throw error;
    }
  }

  static async advancedSearch(user: SessionUser, query: string, filters: SearchFilters, limit = 50): Promise<BuyerServiceResponse> {
    try {
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.ADVANCED_ANALYTICS);
      if (!accessResult.hasAccess) {
        return { success: false, message: 'Advanced search requires Pro subscription', data: { upgradeRequired: true } };
      }
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');

      const whereClause: any = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ],
        status: 'ACTIVE'
      };

      if (filters?.category?.length) whereClause.category = { in: filters.category };
      if (filters?.location?.length) whereClause.location = { in: filters.location };
      if (filters?.budgetRange) whereClause.price = { gte: filters.budgetRange.min, lte: filters.budgetRange.max };
      if (filters?.industry?.length) whereClause.industry = { in: filters.industry };
      if (filters?.rating) whereClause.seller = { rating: { gte: filters.rating } };
      if (filters?.verified !== undefined) whereClause.seller = { ...(whereClause.seller || {}), verified: filters.verified };

      const results = await prisma.msmeListing.findMany({
        where: whereClause,
        include: { seller: { select: { id: true, name: true, rating: true, verified: true, industry: true, location: true } } },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        message: 'Advanced search completed successfully',
        data: {
          results: results.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            location: item.location,
            seller: item.seller,
            images: item.images,
            createdAt: item.createdAt.toISOString()
          })),
          total: results.length,
          query,
          filters
        }
      };
    } catch (error) {
      logger.error('Advanced search failed', { error, userId: user.id, query, filters });
      throw error;
    }
  }

  // Communication
  static async contactSeller(user: SessionUser, sellerId: string, message: string): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      if (!user.isPro) {
        const todayMessages = await prisma.message.count({
          where: { senderId: user.id, createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } }
        });
        if (todayMessages >= 5) {
          return { success: false, message: 'Daily message limit reached. Upgrade to Pro for unlimited messaging.', data: { upgradeRequired: true } };
        }
      }
      const newMessage = await prisma.message.create({ data: { senderId: user.id, receiverId: sellerId, content: message, type: 'INQUIRY' } });
      return { success: true, message: 'Message sent successfully', data: { messageId: newMessage.id, sentAt: newMessage.createdAt.toISOString() } };
    } catch (error) {
      logger.error('Contact seller failed', { error, userId: user.id, sellerId });
      throw error;
    }
  }

  static async getMessageHistory(user: SessionUser, limit = 50): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const messages = await prisma.message.findMany({
        where: { OR: [{ senderId: user.id }, { receiverId: user.id }] },
        include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, message: 'Message history retrieved successfully', data: { messages: messages.map(msg => ({ id: msg.id, content: msg.content, type: msg.type, sender: msg.sender, receiver: msg.receiver, createdAt: msg.createdAt.toISOString() })), total: messages.length } };
    } catch (error) {
      logger.error('Get message history failed', { error, userId: user.id });
      throw error;
    }
  }

  static async getMessageHistoryWithSeller(user: SessionUser, sellerId: string, limit = 50): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const messages = await prisma.message.findMany({
        where: { OR: [ { senderId: user.id, receiverId: sellerId }, { senderId: sellerId, receiverId: user.id } ] },
        include: { sender: { select: { id: true, name: true, email: true } }, receiver: { select: { id: true, name: true, email: true } } },
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      return { success: true, message: 'Conversation retrieved successfully', data: { messages: messages.map(msg => ({ id: msg.id, content: msg.content, type: msg.type, sender: msg.sender, receiver: msg.receiver, createdAt: msg.createdAt.toISOString() })), total: messages.length } };
    } catch (error) {
      logger.error('Get message history (with seller) failed', { error, userId: user.id, sellerId });
      throw error;
    }
  }

  // Saved searches
  static async getSavedSearches(user: SessionUser): Promise<BuyerServiceResponse> {
    try {
      if (!user.isPro) return { success: false, message: 'Saved searches require Pro subscription', data: { upgradeRequired: true } };
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const savedSearches = await prisma.savedSearch.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
      return { success: true, message: 'Saved searches retrieved successfully', data: { searches: savedSearches.map(search => ({ id: search.id, name: search.name, query: search.query, filters: search.filters, createdAt: search.createdAt.toISOString() })) } };
    } catch (error) {
      logger.error('Get saved searches failed', { error, userId: user.id });
      throw error;
    }
  }

  static async saveSearch(user: SessionUser, name: string, query: string, filters?: SearchFilters): Promise<BuyerServiceResponse> {
    try {
      if (!user.isPro) return { success: false, message: 'Saving searches requires Pro subscription', data: { upgradeRequired: true } };
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const savedSearch = await prisma.savedSearch.create({ data: { userId: user.id, name, query, filters: filters as any } });
      return { success: true, message: 'Search saved successfully', data: { search: { id: savedSearch.id, name: savedSearch.name, query: savedSearch.query, filters: savedSearch.filters, createdAt: savedSearch.createdAt.toISOString() } } };
    } catch (error) {
      logger.error('Save search failed', { error, userId: user.id, name });
      throw error;
    }
  }

  static async deleteSavedSearch(user: SessionUser, searchId: string): Promise<BuyerServiceResponse> {
    try {
      if (!user.isPro) return { success: false, message: 'Saved searches require Pro subscription', data: { upgradeRequired: true } };
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      await prisma.savedSearch.delete({ where: { id: searchId } });
      return { success: true, message: 'Saved search deleted', data: { id: searchId } };
    } catch (error) {
      logger.error('Delete saved search failed', { error, userId: user.id, searchId });
      throw error;
    }
  }

  // Analytics
  static async getBuyerAnalytics(user: SessionUser): Promise<BuyerServiceResponse> {
    try {
      if (!user.isPro) return { success: false, message: 'Analytics require Pro subscription', data: { upgradeRequired: true } };
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');

      const totalSearches = await prisma.searchLog.count({ where: { userId: user.id } });
      const totalMessages = await prisma.message.count({ where: { senderId: user.id } });
      const favoriteCategories = await prisma.searchLog.groupBy({ by: ['category'], where: { userId: user.id }, _count: { category: true }, orderBy: { _count: { category: 'desc' } }, take: 5 });

      return {
        success: true,
        message: 'Analytics retrieved successfully',
        data: {
          analytics: {
            totalSearches,
            totalMessages,
            favoriteCategories: favoriteCategories.map(cat => ({ category: cat.category, count: cat._count.category })),
            proFeatures: ['Advanced Search Filters', 'Unlimited Messaging', 'Saved Searches', 'Priority Support']
          }
        }
      };
    } catch (error) {
      logger.error('Get buyer analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  static async getBuyerBasicAnalytics(user: SessionUser): Promise<BuyerServiceResponse> {
    try {
      if (!user.roles.includes('buyer')) throw new Error('User does not have buyer role');
      const totalSearches = await prisma.searchLog.count({ where: { userId: user.id } });
      const totalMessages = await prisma.message.count({ where: { senderId: user.id } });
      return { success: true, message: 'Basic analytics retrieved successfully', data: { analytics: { totalSearches, totalMessages } } };
    } catch (error) {
      logger.error('Get buyer basic analytics failed', { error, userId: user.id });
      throw error;
    }
  }
}
