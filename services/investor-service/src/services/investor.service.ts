import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@shared/types/user';
import { FeatureGatingService } from '@shared/services/featureGating.service';
import { Feature } from '@shared/types/feature';
import { UserRole } from '@shared/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface InvestmentOpportunity {
  id: string;
  msmeId: string;
  msmeName: string;
  businessType: string;
  industry: string;
  location: string;
  investmentAmount: number;
  equityOffered: number;
  valuation: number;
  description: string;
  financialMetrics: {
    annualRevenue: number;
    profitMargin: number;
    growthRate: number;
    debtToEquity: number;
  };
  status: 'OPEN' | 'CLOSED' | 'FUNDED' | 'EXPIRED';
  isEarlyAccess: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface InvestorProfile {
  id: string;
  userId: string;
  investorName: string;
  investmentFocus: string[];
  investmentRange: {
    min: number;
    max: number;
  };
  preferredIndustries: string[];
  experience: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  totalInvestments: number;
  totalAmountInvested: number;
  averageReturn: number;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  investorId: string;
  opportunityId: string;
  amount: number;
  equityPercentage: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface InvestorAnalytics {
  totalOpportunities: number;
  viewedOpportunities: number;
  investedOpportunities: number;
  totalAmountInvested: number;
  averageReturn: number;
  portfolioValue: number;
  investmentHistory: Array<{
    month: string;
    investments: number;
    amount: number;
    returns: number;
  }>;
  topPerformers: Array<{
    opportunityId: string;
    msmeName: string;
    return: number;
    amount: number;
  }>;
}

export interface DirectChat {
  id: string;
  investorId: string;
  msmeId: string;
  msmeName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface InvestorServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class InvestorService {
  /**
   * Browse investment opportunities (basic feature for all investors)
   */
  static async browseOpportunities(user: SessionUser, filters?: any): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can browse opportunities');
      }

      // Mock opportunities (in real scenario, this would be fetched from database)
      const opportunities = [
        {
          id: 'opp-1',
          msmeId: 'msme-1',
          msmeName: 'TechStart Solutions',
          businessType: 'Technology',
          industry: 'SaaS',
          location: 'Bangalore',
          investmentAmount: 500000,
          equityOffered: 15,
          valuation: 3333333,
          description: 'Innovative SaaS platform for small businesses',
          financialMetrics: {
            annualRevenue: 2000000,
            profitMargin: 25,
            growthRate: 40,
            debtToEquity: 0.3
          },
          status: 'OPEN',
          isEarlyAccess: false,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z',
          expiresAt: '2024-04-15T00:00:00Z'
        },
        {
          id: 'opp-2',
          msmeId: 'msme-2',
          msmeName: 'Green Energy Co',
          businessType: 'Manufacturing',
          industry: 'Renewable Energy',
          location: 'Mumbai',
          investmentAmount: 1000000,
          equityOffered: 20,
          valuation: 5000000,
          description: 'Solar panel manufacturing with innovative technology',
          financialMetrics: {
            annualRevenue: 3500000,
            profitMargin: 18,
            growthRate: 35,
            debtToEquity: 0.5
          },
          status: 'OPEN',
          isEarlyAccess: true,
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z',
          expiresAt: '2024-04-10T00:00:00Z'
        }
      ];

      // Filter opportunities based on Pro status
      let filteredOpportunities = opportunities;
      if (!user.isPro) {
        // Free users can only see non-early access opportunities
        filteredOpportunities = opportunities.filter(opp => !opp.isEarlyAccess);
      }

      // Apply additional filters
      if (filters?.industry) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.industry.toLowerCase().includes(filters.industry.toLowerCase())
        );
      }

      if (filters?.location) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters?.minAmount) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.investmentAmount >= filters.minAmount
        );
      }

      if (filters?.maxAmount) {
        filteredOpportunities = filteredOpportunities.filter(opp => 
          opp.investmentAmount <= filters.maxAmount
        );
      }

      return {
        success: true,
        message: 'Opportunities retrieved successfully',
        data: {
          opportunities: filteredOpportunities,
          total: filteredOpportunities.length,
          earlyAccessCount: filteredOpportunities.filter(opp => opp.isEarlyAccess).length
        }
      };
    } catch (error) {
      logger.error('Browse opportunities failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get early access opportunities (Pro feature)
   */
  static async getEarlyAccessOpportunities(user: SessionUser): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can access early opportunities');
      }

      // Check Pro access for early access opportunities
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.EARLY_ACCESS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Early access opportunities require Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock early access opportunities (in real scenario, this would be fetched from database)
      const earlyAccessOpportunities = [
        {
          id: 'opp-3',
          msmeId: 'msme-3',
          msmeName: 'AI Healthcare Solutions',
          businessType: 'Healthcare',
          industry: 'AI/ML',
          location: 'Hyderabad',
          investmentAmount: 750000,
          equityOffered: 12,
          valuation: 6250000,
          description: 'AI-powered diagnostic tools for rural healthcare',
          financialMetrics: {
            annualRevenue: 1500000,
            profitMargin: 30,
            growthRate: 60,
            debtToEquity: 0.2
          },
          status: 'OPEN',
          isEarlyAccess: true,
          createdAt: '2024-01-05T00:00:00Z',
          updatedAt: '2024-01-05T00:00:00Z',
          expiresAt: '2024-04-05T00:00:00Z'
        }
      ];

      return {
        success: true,
        message: 'Early access opportunities retrieved successfully',
        data: {
          opportunities: earlyAccessOpportunities,
          total: earlyAccessOpportunities.length
        }
      };
    } catch (error) {
      logger.error('Get early access opportunities failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get opportunity details
   */
  static async getOpportunityDetails(user: SessionUser, opportunityId: string): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can view opportunity details');
      }

      // Mock opportunity details (in real scenario, this would be fetched from database)
      const opportunity = {
        id: opportunityId,
        msmeId: 'msme-1',
        msmeName: 'TechStart Solutions',
        businessType: 'Technology',
        industry: 'SaaS',
        location: 'Bangalore',
        investmentAmount: 500000,
        equityOffered: 15,
        valuation: 3333333,
        description: 'Innovative SaaS platform for small businesses',
        financialMetrics: {
          annualRevenue: 2000000,
          profitMargin: 25,
          growthRate: 40,
          debtToEquity: 0.3
        },
        status: 'OPEN',
        isEarlyAccess: false,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        expiresAt: '2024-04-15T00:00:00Z',
        additionalDetails: {
          teamSize: 25,
          foundedYear: 2020,
          patents: 3,
          marketSize: '2.5B USD',
          competitiveAdvantage: 'AI-powered automation',
          useOfFunds: 'Product development and market expansion'
        }
      };

      // Check if user has Pro access for early access opportunities
      if (opportunity.isEarlyAccess && !user.isPro) {
        return {
          success: false,
          message: 'This opportunity requires Pro subscription for early access',
          data: { upgradeRequired: true }
        };
      }

      return {
        success: true,
        message: 'Opportunity details retrieved successfully',
        data: {
          opportunity
        }
      };
    } catch (error) {
      logger.error('Get opportunity details failed', { error, userId: user.id, opportunityId });
      throw error;
    }
  }

  /**
   * Express interest in opportunity
   */
  static async expressInterest(user: SessionUser, opportunityId: string, amount: number, notes?: string): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can express interest');
      }

      // Mock investment creation (in real scenario, this would create database record)
      const investment = {
        id: `inv-${Date.now()}`,
        investorId: user.id,
        opportunityId,
        amount,
        equityPercentage: 0, // Will be calculated based on opportunity
        status: 'PENDING',
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      logger.info('Investment interest expressed', {
        investorId: user.id,
        opportunityId,
        amount,
        isPro: user.isPro
      });

      return {
        success: true,
        message: 'Interest expressed successfully',
        data: {
          investment
        }
      };
    } catch (error) {
      logger.error('Express interest failed', { error, userId: user.id, opportunityId });
      throw error;
    }
  }

  /**
   * Get investor profile
   */
  static async getInvestorProfile(user: SessionUser): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can view their profile');
      }

      // Mock investor profile (in real scenario, this would be fetched from database)
      const profile = {
        id: 'profile-1',
        userId: user.id,
        investorName: 'John Investor',
        investmentFocus: ['Technology', 'Healthcare', 'Fintech'],
        investmentRange: {
          min: 100000,
          max: 2000000
        },
        preferredIndustries: ['SaaS', 'AI/ML', 'Digital Health'],
        experience: 8,
        verificationStatus: 'VERIFIED',
        totalInvestments: 15,
        totalAmountInvested: 8500000,
        averageReturn: 18.5,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z'
      };

      return {
        success: true,
        message: 'Investor profile retrieved successfully',
        data: {
          profile
        }
      };
    } catch (error) {
      logger.error('Get investor profile failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update investor profile
   */
  static async updateInvestorProfile(user: SessionUser, updateData: Partial<InvestorProfile>): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can update their profile');
      }

      // Mock profile update (in real scenario, this would update database)
      logger.info('Investor profile updated', {
        investorId: user.id,
        updateData
      });

      return {
        success: true,
        message: 'Investor profile updated successfully',
        data: {
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Update investor profile failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get investor analytics (Pro feature)
   */
  static async getInvestorAnalytics(user: SessionUser): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can view analytics');
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

      // Mock analytics data (in real scenario, this would be calculated from actual data)
      const analytics = {
        totalOpportunities: 45,
        viewedOpportunities: 28,
        investedOpportunities: 15,
        totalAmountInvested: 8500000,
        averageReturn: 18.5,
        portfolioValue: 10075000,
        investmentHistory: [
          { month: '2024-01', investments: 3, amount: 1500000, returns: 225000 },
          { month: '2024-02', investments: 2, amount: 1000000, returns: 150000 },
          { month: '2024-03', investments: 4, amount: 2000000, returns: 300000 }
        ],
        topPerformers: [
          { opportunityId: 'opp-1', msmeName: 'TechStart Solutions', return: 25.5, amount: 500000 },
          { opportunityId: 'opp-2', msmeName: 'Green Energy Co', return: 18.2, amount: 1000000 }
        ]
      };

      return {
        success: true,
        message: 'Investor analytics retrieved successfully',
        data: {
          analytics
        }
      };
    } catch (error) {
      logger.error('Get investor analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get direct chat with MSME (Pro feature)
   */
  static async getDirectChats(user: SessionUser): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can access direct chats');
      }

      // Check Pro access for direct investor-seller communication
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.DIRECT_COMMUNICATION);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Direct communication requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock direct chats (in real scenario, this would be fetched from database)
      const directChats = [
        {
          id: 'chat-1',
          investorId: user.id,
          msmeId: 'msme-1',
          msmeName: 'TechStart Solutions',
          lastMessage: 'Thank you for your interest in our opportunity!',
          lastMessageAt: '2024-01-20T10:30:00Z',
          unreadCount: 2,
          status: 'ACTIVE'
        },
        {
          id: 'chat-2',
          investorId: user.id,
          msmeId: 'msme-2',
          msmeName: 'Green Energy Co',
          lastMessage: 'We would love to discuss the investment details.',
          lastMessageAt: '2024-01-19T15:45:00Z',
          unreadCount: 0,
          status: 'ACTIVE'
        }
      ];

      return {
        success: true,
        message: 'Direct chats retrieved successfully',
        data: {
          chats: directChats,
          total: directChats.length,
          unreadTotal: directChats.reduce((sum, chat) => sum + chat.unreadCount, 0)
        }
      };
    } catch (error) {
      logger.error('Get direct chats failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get investment history
   */
  static async getInvestmentHistory(user: SessionUser): Promise<InvestorServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.INVESTOR)) {
        throw new Error('Only Investors can view investment history');
      }

      // Mock investment history (in real scenario, this would be fetched from database)
      const investments = [
        {
          id: 'inv-1',
          opportunityId: 'opp-1',
          amount: 500000,
          equityPercentage: 15,
          status: 'COMPLETED',
          notes: 'Great opportunity in SaaS sector',
          createdAt: '2024-01-15T00:00:00Z',
          completedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: 'inv-2',
          opportunityId: 'opp-2',
          amount: 1000000,
          equityPercentage: 20,
          status: 'PENDING',
          notes: 'Promising renewable energy company',
          createdAt: '2024-01-18T00:00:00Z'
        }
      ];

      return {
        success: true,
        message: 'Investment history retrieved successfully',
        data: {
          investments,
          total: investments.length,
          totalInvested: investments
            .filter(inv => inv.status === 'COMPLETED')
            .reduce((sum, inv) => sum + inv.amount, 0)
        }
      };
    } catch (error) {
      logger.error('Get investment history failed', { error, userId: user.id });
      throw error;
    }
  }
}
