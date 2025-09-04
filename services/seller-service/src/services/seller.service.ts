import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@msmebazaar/types/user';
import { FeatureGatingService } from '@msmebazaar/shared/services/featureGating.service';
import { Feature } from '@msmebazaar/types/feature';
import { UserRole } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  status: 'DRAFT' | 'ACTIVE' | 'SOLD' | 'INACTIVE';
  isFeatured: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  phone: string;
  website?: string;
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rating: number;
  totalSales: number;
  createdAt: string;
  updatedAt: string;
}

export interface SellerAnalytics {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  conversionRate: number;
  averageResponseTime: number;
  monthlyRevenue: number;
  topPerformingListings: Array<{
    id: string;
    title: string;
    views: number;
    inquiries: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    views: number;
    inquiries: number;
    revenue: number;
  }>;
}

export interface Inquiry {
  id: string;
  listingId: string;
  buyerId: string;
  message: string;
  status: 'PENDING' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  respondedAt?: string;
}

export interface SellerServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class SellerService {
  /**
   * Create a new listing (basic feature for all sellers)
   */
  static async createListing(user: SessionUser, listingData: Partial<Listing>): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can create listings');
      }

      // Check listing limit based on Pro status
      const existingListings = await prisma.listing.count({
        where: { sellerId: user.id, status: 'ACTIVE' }
      });

      const maxListings = user.isPro ? 10 : 1;
      if (existingListings >= maxListings) {
        return {
          success: false,
          message: user.isPro 
            ? 'You have reached the maximum number of active listings (10)'
            : 'Free users can only have 1 active listing. Upgrade to Pro for multiple listings.',
          data: { upgradeRequired: !user.isPro }
        };
      }

      const listing = await prisma.listing.create({
        data: {
          sellerId: user.id,
          title: listingData.title!,
          description: listingData.description!,
          category: listingData.category!,
          price: listingData.price!,
          currency: listingData.currency || 'INR',
          location: listingData.location!,
          images: listingData.images || [],
          status: 'DRAFT',
          isFeatured: false,
          views: 0,
          inquiries: 0
        }
      });

      logger.info('Listing created', { 
        listingId: listing.id, 
        sellerId: user.id,
        isPro: user.isPro 
      });

      return {
        success: true,
        message: 'Listing created successfully',
        data: {
          listing: {
            id: listing.id,
            sellerId: listing.sellerId,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            price: listing.price,
            currency: listing.currency,
            location: listing.location,
            images: listing.images,
            status: listing.status,
            isFeatured: listing.isFeatured,
            views: listing.views,
            inquiries: listing.inquiries,
            createdAt: listing.createdAt.toISOString(),
            updatedAt: listing.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Create listing failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Publish listing (make it active)
   */
  static async publishListing(user: SessionUser, listingId: string): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can publish listings');
      }

      const listing = await prisma.listing.findFirst({
        where: { id: listingId, sellerId: user.id }
      });

      if (!listing) {
        return {
          success: false,
          message: 'Listing not found'
        };
      }

      if (listing.status !== 'DRAFT') {
        return {
          success: false,
          message: 'Only draft listings can be published'
        };
      }

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: { 
          status: 'ACTIVE',
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Listing published successfully',
        data: {
          listing: {
            id: updatedListing.id,
            status: updatedListing.status,
            updatedAt: updatedListing.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Publish listing failed', { error, userId: user.id, listingId });
      throw error;
    }
  }

  /**
   * Boost listing (Pro feature)
   */
  static async boostListing(user: SessionUser, listingId: string): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can boost listings');
      }

      // Check Pro access for featured listing boost
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.FEATURED_LISTINGS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Featured listing boost requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      const listing = await prisma.listing.findFirst({
        where: { id: listingId, sellerId: user.id }
      });

      if (!listing) {
        return {
          success: false,
          message: 'Listing not found'
        };
      }

      if (listing.status !== 'ACTIVE') {
        return {
          success: false,
          message: 'Only active listings can be boosted'
        };
      }

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: { 
          isFeatured: true,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Listing boosted successfully',
        data: {
          listing: {
            id: updatedListing.id,
            isFeatured: updatedListing.isFeatured,
            updatedAt: updatedListing.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Boost listing failed', { error, userId: user.id, listingId });
      throw error;
    }
  }

  /**
   * Get seller's listings
   */
  static async getSellerListings(user: SessionUser): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can view their listings');
      }

      const listings = await prisma.listing.findMany({
        where: { sellerId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        message: 'Listings retrieved successfully',
        data: {
          listings: listings.map(listing => ({
            id: listing.id,
            title: listing.title,
            category: listing.category,
            price: listing.price,
            currency: listing.currency,
            location: listing.location,
            status: listing.status,
            isFeatured: listing.isFeatured,
            views: listing.views,
            inquiries: listing.inquiries,
            createdAt: listing.createdAt.toISOString(),
            updatedAt: listing.updatedAt.toISOString()
          })),
          total: listings.length,
          activeCount: listings.filter(l => l.status === 'ACTIVE').length
        }
      };
    } catch (error) {
      logger.error('Get seller listings failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get listing details
   */
  static async getListingDetails(user: SessionUser, listingId: string): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can view listing details');
      }

      const listing = await prisma.listing.findFirst({
        where: { id: listingId, sellerId: user.id },
        include: {
          inquiries: true
        }
      });

      if (!listing) {
        return {
          success: false,
          message: 'Listing not found'
        };
      }

      return {
        success: true,
        message: 'Listing details retrieved successfully',
        data: {
          listing: {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            price: listing.price,
            currency: listing.currency,
            location: listing.location,
            images: listing.images,
            status: listing.status,
            isFeatured: listing.isFeatured,
            views: listing.views,
            inquiries: listing.inquiries.length,
            createdAt: listing.createdAt.toISOString(),
            updatedAt: listing.updatedAt.toISOString()
          },
          inquiries: listing.inquiries.map(inquiry => ({
            id: inquiry.id,
            buyerId: inquiry.buyerId,
            message: inquiry.message,
            status: inquiry.status,
            createdAt: inquiry.createdAt.toISOString()
          }))
        }
      };
    } catch (error) {
      logger.error('Get listing details failed', { error, userId: user.id, listingId });
      throw error;
    }
  }

  /**
   * Update listing
   */
  static async updateListing(user: SessionUser, listingId: string, updateData: Partial<Listing>): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can update listings');
      }

      const listing = await prisma.listing.findFirst({
        where: { id: listingId, sellerId: user.id }
      });

      if (!listing) {
        return {
          success: false,
          message: 'Listing not found'
        };
      }

      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Listing updated successfully',
        data: {
          listing: {
            id: updatedListing.id,
            title: updatedListing.title,
            description: updatedListing.description,
            category: updatedListing.category,
            price: updatedListing.price,
            currency: updatedListing.currency,
            location: updatedListing.location,
            images: updatedListing.images,
            status: updatedListing.status,
            isFeatured: updatedListing.isFeatured,
            updatedAt: updatedListing.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Update listing failed', { error, userId: user.id, listingId });
      throw error;
    }
  }

  /**
   * Get seller analytics (Pro feature for advanced analytics)
   */
  static async getSellerAnalytics(user: SessionUser): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can view analytics');
      }

      // Check Pro access for advanced analytics
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.ADVANCED_ANALYTICS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Advanced analytics requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Get analytics data
      const totalListings = await prisma.listing.count({
        where: { sellerId: user.id }
      });

      const activeListings = await prisma.listing.count({
        where: { 
          sellerId: user.id,
          status: 'ACTIVE'
        }
      });

      const totalViews = await prisma.listing.aggregate({
        where: { sellerId: user.id },
        _sum: { views: true }
      });

      const totalInquiries = await prisma.inquiry.count({
        where: { 
          listing: { sellerId: user.id }
        }
      });

      // Get top performing listings
      const topListings = await prisma.listing.findMany({
        where: { 
          sellerId: user.id,
          status: 'ACTIVE'
        },
        orderBy: { views: 'desc' },
        take: 5
      });

      // Calculate conversion rate
      const conversionRate = totalViews._sum.views && totalInquiries 
        ? (totalInquiries / totalViews._sum.views) * 100 
        : 0;

      // Mock monthly trends (in real scenario, this would be calculated from actual data)
      const monthlyTrends = [
        { month: '2024-01', views: 150, inquiries: 12, revenue: 50000 },
        { month: '2024-02', views: 180, inquiries: 15, revenue: 65000 },
        { month: '2024-03', views: 220, inquiries: 18, revenue: 75000 }
      ];

      return {
        success: true,
        message: 'Analytics retrieved successfully',
        data: {
          analytics: {
            totalListings,
            activeListings,
            totalViews: totalViews._sum.views || 0,
            totalInquiries,
            conversionRate: Math.round(conversionRate * 100) / 100,
            averageResponseTime: 2.5, // Mock data
            monthlyRevenue: 75000, // Mock data
            topPerformingListings: topListings.map(listing => ({
              id: listing.id,
              title: listing.title,
              views: listing.views,
              inquiries: listing.inquiries
            })),
            monthlyTrends
          }
        }
      };
    } catch (error) {
      logger.error('Get seller analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get basic analytics (available to all sellers)
   */
  static async getBasicAnalytics(user: SessionUser): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can view analytics');
      }

      const totalListings = await prisma.listing.count({
        where: { sellerId: user.id }
      });

      const activeListings = await prisma.listing.count({
        where: { 
          sellerId: user.id,
          status: 'ACTIVE'
        }
      });

      const totalViews = await prisma.listing.aggregate({
        where: { sellerId: user.id },
        _sum: { views: true }
      });

      const totalInquiries = await prisma.inquiry.count({
        where: { 
          listing: { sellerId: user.id }
        }
      });

      return {
        success: true,
        message: 'Basic analytics retrieved successfully',
        data: {
          analytics: {
            totalListings,
            activeListings,
            totalViews: totalViews._sum.views || 0,
            totalInquiries,
            conversionRate: totalViews._sum.views && totalInquiries 
              ? Math.round((totalInquiries / totalViews._sum.views) * 10000) / 100 
              : 0
          }
        }
      };
    } catch (error) {
      logger.error('Get basic analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Respond to inquiry
   */
  static async respondToInquiry(user: SessionUser, inquiryId: string, response: string): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can respond to inquiries');
      }

      const inquiry = await prisma.inquiry.findFirst({
        where: { 
          id: inquiryId,
          listing: { sellerId: user.id }
        }
      });

      if (!inquiry) {
        return {
          success: false,
          message: 'Inquiry not found'
        };
      }

      const updatedInquiry = await prisma.inquiry.update({
        where: { id: inquiryId },
        data: {
          status: 'RESPONDED',
          respondedAt: new Date()
        }
      });

      // Send notification to buyer (mock implementation)
      await this.sendNotification({
        userId: inquiry.buyerId,
        type: 'inquiry-response',
        message: `Seller has responded to your inquiry about ${inquiry.listing?.title}`
      });

      return {
        success: true,
        message: 'Response sent successfully',
        data: {
          inquiry: {
            id: updatedInquiry.id,
            status: updatedInquiry.status,
            respondedAt: updatedInquiry.respondedAt?.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Respond to inquiry failed', { error, userId: user.id, inquiryId });
      throw error;
    }
  }

  /**
   * Get seller profile
   */
  static async getSellerProfile(user: SessionUser): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can view their profile');
      }

      const profile = await prisma.sellerProfile.findUnique({
        where: { userId: user.id }
      });

      if (!profile) {
        return {
          success: false,
          message: 'Seller profile not found'
        };
      }

      return {
        success: true,
        message: 'Seller profile retrieved successfully',
        data: {
          profile: {
            id: profile.id,
            userId: profile.userId,
            businessName: profile.businessName,
            businessType: profile.businessType,
            description: profile.description,
            address: profile.address,
            phone: profile.phone,
            website: profile.website,
            socialMedia: profile.socialMedia,
            verificationStatus: profile.verificationStatus,
            rating: profile.rating,
            totalSales: profile.totalSales,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get seller profile failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update seller profile
   */
  static async updateSellerProfile(user: SessionUser, updateData: Partial<SellerProfile>): Promise<SellerServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SELLER)) {
        throw new Error('Only Sellers can update their profile');
      }

      const profile = await prisma.sellerProfile.findUnique({
        where: { userId: user.id }
      });

      if (!profile) {
        return {
          success: false,
          message: 'Seller profile not found'
        };
      }

      const updatedProfile = await prisma.sellerProfile.update({
        where: { userId: user.id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Seller profile updated successfully',
        data: {
          profile: {
            id: updatedProfile.id,
            businessName: updatedProfile.businessName,
            businessType: updatedProfile.businessType,
            description: updatedProfile.description,
            address: updatedProfile.address,
            phone: updatedProfile.phone,
            website: updatedProfile.website,
            socialMedia: updatedProfile.socialMedia,
            verificationStatus: updatedProfile.verificationStatus,
            rating: updatedProfile.rating,
            totalSales: updatedProfile.totalSales,
            updatedAt: updatedProfile.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Update seller profile failed', { error, userId: user.id });
      throw error;
    }
  }

  // Private helper methods
  private static async sendNotification(notification: any): Promise<void> {
    // Mock notification sending - in real scenario, this would call notification service
    logger.info('Notification sent', notification);
  }
}
