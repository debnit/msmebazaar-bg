import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@msmebazaar/types/user';
import { FeatureGatingService } from '@msmebazaar/shared/services/featureGating.service';
import { Feature } from '@msmebazaar/types/feature';
import { UserRole } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface Deal {
  id: string;
  agentId: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  status: 'INITIATED' | 'NEGOTIATING' | 'AGREED' | 'COMPLETED' | 'CANCELLED';
  commissionRate: number;
  commissionAmount: number;
  dealValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AgentProfile {
  id: string;
  userId: string;
  agentName: string;
  specialization: string;
  experience: number;
  licenseNumber: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  rating: number;
  totalDeals: number;
  totalCommission: number;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  agentId: string;
  dealId: string;
  amount: number;
  rate: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  paidAt?: string;
  createdAt: string;
}

export interface AgentAnalytics {
  totalDeals: number;
  activeDeals: number;
  completedDeals: number;
  totalCommission: number;
  averageCommission: number;
  conversionRate: number;
  monthlyEarnings: Array<{
    month: string;
    deals: number;
    commission: number;
  }>;
  topPerformers: Array<{
    agentId: string;
    agentName: string;
    deals: number;
    commission: number;
  }>;
}

export interface CRMDashboard {
  leads: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
    source: string;
    createdAt: string;
  }>;
  deals: Array<{
    id: string;
    buyerName: string;
    sellerName: string;
    value: number;
    status: string;
    probability: number;
  }>;
  activities: Array<{
    id: string;
    type: 'CALL' | 'EMAIL' | 'MEETING' | 'FOLLOW_UP';
    description: string;
    date: string;
    outcome: string;
  }>;
  pipeline: {
    totalValue: number;
    stages: Array<{
      stage: string;
      count: number;
      value: number;
    }>;
  };
}

export interface AgentServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class AgentService {
  /**
   * Create a new deal (basic feature for all agents)
   */
  static async createDeal(user: SessionUser, dealData: Partial<Deal>): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can create deals');
      }

      // Check deal limit based on Pro status
      const activeDeals = await prisma.deal.count({
        where: { 
          agentId: user.id,
          status: { in: ['INITIATED', 'NEGOTIATING'] }
        }
      });

      const maxDeals = user.isPro ? 10 : 3;
      if (activeDeals >= maxDeals) {
        return {
          success: false,
          message: user.isPro 
            ? 'You have reached the maximum number of active deals (10)'
            : 'Free agents can only have 3 active deals. Upgrade to Pro for more deals.',
          data: { upgradeRequired: !user.isPro }
        };
      }

      // Set commission rate based on Pro status
      const commissionRate = user.isPro ? 0.05 : 0.03; // 5% for Pro, 3% for basic

      const deal = await prisma.deal.create({
        data: {
          agentId: user.id,
          buyerId: dealData.buyerId!,
          sellerId: dealData.sellerId!,
          listingId: dealData.listingId!,
          status: 'INITIATED',
          commissionRate,
          commissionAmount: 0,
          dealValue: dealData.dealValue!,
          notes: dealData.notes || ''
        }
      });

      logger.info('Deal created', { 
        dealId: deal.id, 
        agentId: user.id,
        isPro: user.isPro 
      });

      return {
        success: true,
        message: 'Deal created successfully',
        data: {
          deal: {
            id: deal.id,
            agentId: deal.agentId,
            buyerId: deal.buyerId,
            sellerId: deal.sellerId,
            listingId: deal.listingId,
            status: deal.status,
            commissionRate: deal.commissionRate,
            commissionAmount: deal.commissionAmount,
            dealValue: deal.dealValue,
            notes: deal.notes,
            createdAt: deal.createdAt.toISOString(),
            updatedAt: deal.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Create deal failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update deal status
   */
  static async updateDealStatus(user: SessionUser, dealId: string, status: Deal['status']): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can update deals');
      }

      const deal = await prisma.deal.findFirst({
        where: { id: dealId, agentId: user.id }
      });

      if (!deal) {
        return {
          success: false,
          message: 'Deal not found'
        };
      }

      const updateData: any = { 
        status,
        updatedAt: new Date()
      };

      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
        updateData.commissionAmount = deal.dealValue * deal.commissionRate;
      }

      const updatedDeal = await prisma.deal.update({
        where: { id: dealId },
        data: updateData
      });

      // Create commission record if deal is completed
      if (status === 'COMPLETED') {
        await prisma.commission.create({
          data: {
            agentId: user.id,
            dealId: dealId,
            amount: updatedDeal.commissionAmount,
            rate: updatedDeal.commissionRate,
            status: 'PENDING'
          }
        });
      }

      return {
        success: true,
        message: 'Deal status updated successfully',
        data: {
          deal: {
            id: updatedDeal.id,
            status: updatedDeal.status,
            commissionAmount: updatedDeal.commissionAmount,
            updatedAt: updatedDeal.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Update deal status failed', { error, userId: user.id, dealId });
      throw error;
    }
  }

  /**
   * Get agent's deals
   */
  static async getAgentDeals(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view their deals');
      }

      const deals = await prisma.deal.findMany({
        where: { agentId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        message: 'Deals retrieved successfully',
        data: {
          deals: deals.map(deal => ({
            id: deal.id,
            buyerId: deal.buyerId,
            sellerId: deal.sellerId,
            listingId: deal.listingId,
            status: deal.status,
            commissionRate: deal.commissionRate,
            commissionAmount: deal.commissionAmount,
            dealValue: deal.dealValue,
            notes: deal.notes,
            createdAt: deal.createdAt.toISOString(),
            updatedAt: deal.updatedAt.toISOString()
          })),
          total: deals.length,
          activeCount: deals.filter(d => ['INITIATED', 'NEGOTIATING'].includes(d.status)).length
        }
      };
    } catch (error) {
      logger.error('Get agent deals failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get deal details
   */
  static async getDealDetails(user: SessionUser, dealId: string): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view deal details');
      }

      const deal = await prisma.deal.findFirst({
        where: { id: dealId, agentId: user.id },
        include: {
          commission: true
        }
      });

      if (!deal) {
        return {
          success: false,
          message: 'Deal not found'
        };
      }

      return {
        success: true,
        message: 'Deal details retrieved successfully',
        data: {
          deal: {
            id: deal.id,
            buyerId: deal.buyerId,
            sellerId: deal.sellerId,
            listingId: deal.listingId,
            status: deal.status,
            commissionRate: deal.commissionRate,
            commissionAmount: deal.commissionAmount,
            dealValue: deal.dealValue,
            notes: deal.notes,
            createdAt: deal.createdAt.toISOString(),
            updatedAt: deal.updatedAt.toISOString(),
            completedAt: deal.completedAt?.toISOString()
          },
          commission: deal.commission ? {
            id: deal.commission.id,
            amount: deal.commission.amount,
            rate: deal.commission.rate,
            status: deal.commission.status,
            paidAt: deal.commission.paidAt?.toISOString()
          } : null
        }
      };
    } catch (error) {
      logger.error('Get deal details failed', { error, userId: user.id, dealId });
      throw error;
    }
  }

  /**
   * Get agent analytics (Pro feature)
   */
  static async getAgentAnalytics(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view analytics');
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
      const totalDeals = await prisma.deal.count({
        where: { agentId: user.id }
      });

      const activeDeals = await prisma.deal.count({
        where: { 
          agentId: user.id,
          status: { in: ['INITIATED', 'NEGOTIATING'] }
        }
      });

      const completedDeals = await prisma.deal.count({
        where: { 
          agentId: user.id,
          status: 'COMPLETED'
        }
      });

      const totalCommission = await prisma.commission.aggregate({
        where: { 
          agentId: user.id,
          status: 'PAID'
        },
        _sum: { amount: true }
      });

      const averageCommission = await prisma.commission.aggregate({
        where: { 
          agentId: user.id,
          status: 'PAID'
        },
        _avg: { amount: true }
      });

      // Calculate conversion rate
      const conversionRate = totalDeals > 0 ? (completedDeals / totalDeals) * 100 : 0;

      // Mock monthly earnings (in real scenario, this would be calculated from actual data)
      const monthlyEarnings = [
        { month: '2024-01', deals: 5, commission: 25000 },
        { month: '2024-02', deals: 7, commission: 35000 },
        { month: '2024-03', deals: 6, commission: 30000 }
      ];

      // Mock top performers (in real scenario, this would be calculated from actual data)
      const topPerformers = [
        { agentId: 'agent-1', agentName: 'John Doe', deals: 15, commission: 75000 },
        { agentId: 'agent-2', agentName: 'Jane Smith', deals: 12, commission: 60000 }
      ];

      return {
        success: true,
        message: 'Analytics retrieved successfully',
        data: {
          analytics: {
            totalDeals,
            activeDeals,
            completedDeals,
            totalCommission: totalCommission._sum.amount || 0,
            averageCommission: averageCommission._avg.amount || 0,
            conversionRate: Math.round(conversionRate * 100) / 100,
            monthlyEarnings,
            topPerformers
          }
        }
      };
    } catch (error) {
      logger.error('Get agent analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get basic analytics (available to all agents)
   */
  static async getBasicAnalytics(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view analytics');
      }

      const totalDeals = await prisma.deal.count({
        where: { agentId: user.id }
      });

      const activeDeals = await prisma.deal.count({
        where: { 
          agentId: user.id,
          status: { in: ['INITIATED', 'NEGOTIATING'] }
        }
      });

      const completedDeals = await prisma.deal.count({
        where: { 
          agentId: user.id,
          status: 'COMPLETED'
        }
      });

      const totalCommission = await prisma.commission.aggregate({
        where: { 
          agentId: user.id,
          status: 'PAID'
        },
        _sum: { amount: true }
      });

      return {
        success: true,
        message: 'Basic analytics retrieved successfully',
        data: {
          analytics: {
            totalDeals,
            activeDeals,
            completedDeals,
            totalCommission: totalCommission._sum.amount || 0,
            conversionRate: totalDeals > 0 ? Math.round((completedDeals / totalDeals) * 10000) / 100 : 0
          }
        }
      };
    } catch (error) {
      logger.error('Get basic analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get CRM dashboard (Pro feature)
   */
  static async getCRMDashboard(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can access CRM dashboard');
      }

      // Check Pro access for CRM dashboard
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.CRM_DASHBOARD);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'CRM dashboard requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock CRM data (in real scenario, this would be fetched from actual data)
      const leads = [
        {
          id: 'lead-1',
          name: 'John Buyer',
          email: 'john@example.com',
          phone: '+1234567890',
          status: 'QUALIFIED',
          source: 'Website',
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      const deals = [
        {
          id: 'deal-1',
          buyerName: 'John Buyer',
          sellerName: 'Jane Seller',
          value: 500000,
          status: 'NEGOTIATING',
          probability: 75
        }
      ];

      const activities = [
        {
          id: 'activity-1',
          type: 'CALL',
          description: 'Follow-up call with John Buyer',
          date: '2024-01-20T00:00:00Z',
          outcome: 'Positive response'
        }
      ];

      const pipeline = {
        totalValue: 1500000,
        stages: [
          { stage: 'LEAD', count: 5, value: 500000 },
          { stage: 'NEGOTIATING', count: 3, value: 750000 },
          { stage: 'CLOSING', count: 2, value: 250000 }
        ]
      };

      return {
        success: true,
        message: 'CRM dashboard retrieved successfully',
        data: {
          crm: {
            leads,
            deals,
            activities,
            pipeline
          }
        }
      };
    } catch (error) {
      logger.error('Get CRM dashboard failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get agent profile
   */
  static async getAgentProfile(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view their profile');
      }

      const profile = await prisma.agentProfile.findUnique({
        where: { userId: user.id }
      });

      if (!profile) {
        return {
          success: false,
          message: 'Agent profile not found'
        };
      }

      return {
        success: true,
        message: 'Agent profile retrieved successfully',
        data: {
          profile: {
            id: profile.id,
            userId: profile.userId,
            agentName: profile.agentName,
            specialization: profile.specialization,
            experience: profile.experience,
            licenseNumber: profile.licenseNumber,
            contactInfo: profile.contactInfo,
            verificationStatus: profile.verificationStatus,
            rating: profile.rating,
            totalDeals: profile.totalDeals,
            totalCommission: profile.totalCommission,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get agent profile failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update agent profile
   */
  static async updateAgentProfile(user: SessionUser, updateData: Partial<AgentProfile>): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can update their profile');
      }

      const profile = await prisma.agentProfile.findUnique({
        where: { userId: user.id }
      });

      if (!profile) {
        return {
          success: false,
          message: 'Agent profile not found'
        };
      }

      const updatedProfile = await prisma.agentProfile.update({
        where: { userId: user.id },
        data: {
          ...updateData,
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Agent profile updated successfully',
        data: {
          profile: {
            id: updatedProfile.id,
            agentName: updatedProfile.agentName,
            specialization: updatedProfile.specialization,
            experience: updatedProfile.experience,
            licenseNumber: updatedProfile.licenseNumber,
            contactInfo: updatedProfile.contactInfo,
            verificationStatus: updatedProfile.verificationStatus,
            rating: updatedProfile.rating,
            totalDeals: updatedProfile.totalDeals,
            totalCommission: updatedProfile.totalCommission,
            updatedAt: updatedProfile.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Update agent profile failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get commission history
   */
  static async getCommissionHistory(user: SessionUser): Promise<AgentServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.AGENT)) {
        throw new Error('Only Agents can view commission history');
      }

      const commissions = await prisma.commission.findMany({
        where: { agentId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        message: 'Commission history retrieved successfully',
        data: {
          commissions: commissions.map(commission => ({
            id: commission.id,
            dealId: commission.dealId,
            amount: commission.amount,
            rate: commission.rate,
            status: commission.status,
            paidAt: commission.paidAt?.toISOString(),
            createdAt: commission.createdAt.toISOString()
          })),
          total: commissions.length,
          totalEarned: commissions
            .filter(c => c.status === 'PAID')
            .reduce((sum, c) => sum + c.amount, 0)
        }
      };
    } catch (error) {
      logger.error('Get commission history failed', { error, userId: user.id });
      throw error;
    }
  }
}
