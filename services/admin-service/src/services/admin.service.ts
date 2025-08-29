import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@msmebazaar/types/user';
import { FeatureGatingService } from '@msmebazaar/shared/services/featureGating.service';
import { Feature } from '@msmebazaar/types/feature';
import { UserRole } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface UserManagement {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
  isPro: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  lastLoginAt?: string;
}

export interface SystemAnalytics {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  userDistribution: {
    buyers: number;
    sellers: number;
    agents: number;
    msmeOwners: number;
    investors: number;
  };
  revenueTrends: Array<{
    month: string;
    revenue: number;
    newUsers: number;
  }>;
  topPerformingFeatures: Array<{
    feature: string;
    usage: number;
    revenue: number;
  }>;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  proOnly: boolean;
  rolesEnabled: UserRole[];
  rolloutPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  services: Array<{
    name: string;
    status: 'HEALTHY' | 'DEGRADED' | 'DOWN';
    responseTime: number;
    uptime: number;
  }>;
  database: {
    status: string;
    connections: number;
    queriesPerSecond: number;
  };
  cache: {
    status: string;
    hitRate: number;
    memoryUsage: number;
  };
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'DOWN';
}

export interface AdminServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class AdminService {
  /**
   * Get user management list (basic feature for all admins)
   */
  static async getUserManagement(user: SessionUser, page: number = 1, limit: number = 20): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can access user management');
      }

      const offset = (page - 1) * limit;

      const users = await prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
          isPro: true,
          status: true,
          createdAt: true,
          lastLoginAt: true
        }
      });

      const totalUsers = await prisma.user.count();

      return {
        success: true,
        message: 'User management data retrieved successfully',
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            isPro: user.isPro,
            status: user.status,
            createdAt: user.createdAt.toISOString(),
            lastLoginAt: user.lastLoginAt?.toISOString()
          })),
          pagination: {
            page,
            limit,
            total: totalUsers,
            totalPages: Math.ceil(totalUsers / limit)
          }
        }
      };
    } catch (error) {
      logger.error('Get user management failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update user status
   */
  static async updateUserStatus(user: SessionUser, targetUserId: string, status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can update user status');
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId }
      });

      if (!targetUser) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      // Prevent admin from suspending/deleting super admin
      if (targetUser.roles.includes(UserRole.SUPER_ADMIN) && user.roles.includes(UserRole.ADMIN)) {
        return {
          success: false,
          message: 'Admins cannot modify Super Admin accounts'
        };
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { status }
      });

      logger.info('User status updated', {
        adminId: user.id,
        targetUserId,
        status,
        isSuperAdmin: user.roles.includes(UserRole.SUPER_ADMIN)
      });

      return {
        success: true,
        message: 'User status updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            status: updatedUser.status
          }
        }
      };
    } catch (error) {
      logger.error('Update user status failed', { error, userId: user.id, targetUserId });
      throw error;
    }
  }

  /**
   * Get basic system analytics (available to all admins)
   */
  static async getBasicAnalytics(user: SessionUser): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can view system analytics');
      }

      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { status: 'ACTIVE' }
      });
      const proUsers = await prisma.user.count({
        where: { isPro: true, status: 'ACTIVE' }
      });

      // Mock revenue data (in real scenario, this would be calculated from actual data)
      const totalRevenue = 1500000; // ₹15 Lakhs
      const monthlyGrowth = 12.5; // 12.5%

      const userDistribution = {
        buyers: await prisma.user.count({
          where: { roles: { has: UserRole.BUYER }, status: 'ACTIVE' }
        }),
        sellers: await prisma.user.count({
          where: { roles: { has: UserRole.SELLER }, status: 'ACTIVE' }
        }),
        agents: await prisma.user.count({
          where: { roles: { has: UserRole.AGENT }, status: 'ACTIVE' }
        }),
        msmeOwners: await prisma.user.count({
          where: { roles: { has: UserRole.MSME_OWNER }, status: 'ACTIVE' }
        }),
        investors: await prisma.user.count({
          where: { roles: { has: UserRole.INVESTOR }, status: 'ACTIVE' }
        })
      };

      return {
        success: true,
        message: 'Basic analytics retrieved successfully',
        data: {
          analytics: {
            totalUsers,
            activeUsers,
            proUsers,
            totalRevenue,
            monthlyGrowth,
            userDistribution
          }
        }
      };
    } catch (error) {
      logger.error('Get basic analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get advanced system analytics (Pro feature)
   */
  static async getAdvancedAnalytics(user: SessionUser): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can view system analytics');
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

      // Get basic analytics first
      const basicAnalytics = await this.getBasicAnalytics(user);
      if (!basicAnalytics.success) {
        return basicAnalytics;
      }

      // Mock advanced analytics data (in real scenario, this would be calculated from actual data)
      const revenueTrends = [
        { month: '2024-01', revenue: 1200000, newUsers: 150 },
        { month: '2024-02', revenue: 1350000, newUsers: 180 },
        { month: '2024-03', revenue: 1500000, newUsers: 200 }
      ];

      const topPerformingFeatures = [
        { feature: 'AI Business Valuation', usage: 85, revenue: 450000 },
        { feature: 'Advanced Analytics', usage: 72, revenue: 360000 },
        { feature: 'CRM Dashboard', usage: 68, revenue: 340000 },
        { feature: 'Featured Listings', usage: 55, revenue: 275000 }
      ];

      return {
        success: true,
        message: 'Advanced analytics retrieved successfully',
        data: {
          analytics: {
            ...basicAnalytics.data.analytics,
            revenueTrends,
            topPerformingFeatures
          }
        }
      };
    } catch (error) {
      logger.error('Get advanced analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get feature flags (Pro feature)
   */
  static async getFeatureFlags(user: SessionUser): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can view feature flags');
      }

      // Check Pro access for feature flag management
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.FEATURE_FLAGS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Feature flag management requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock feature flags (in real scenario, this would be fetched from database)
      const featureFlags = [
        {
          id: 'flag-1',
          name: 'AI_BUSINESS_VALUATION',
          description: 'AI-powered business valuation for MSME Owners',
          enabled: true,
          proOnly: true,
          rolesEnabled: [UserRole.MSME_OWNER, UserRole.INVESTOR],
          rolloutPercentage: 100,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'flag-2',
          name: 'ADVANCED_ANALYTICS',
          description: 'Advanced analytics dashboard for Pro users',
          enabled: true,
          proOnly: true,
          rolesEnabled: [UserRole.SELLER, UserRole.AGENT, UserRole.ADMIN],
          rolloutPercentage: 100,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        },
        {
          id: 'flag-3',
          name: 'CRM_DASHBOARD',
          description: 'CRM dashboard for agents',
          enabled: true,
          proOnly: true,
          rolesEnabled: [UserRole.AGENT],
          rolloutPercentage: 75,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        }
      ];

      return {
        success: true,
        message: 'Feature flags retrieved successfully',
        data: {
          featureFlags
        }
      };
    } catch (error) {
      logger.error('Get feature flags failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update feature flag
   */
  static async updateFeatureFlag(user: SessionUser, flagId: string, updateData: Partial<FeatureFlag>): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can update feature flags');
      }

      // Check Pro access for feature flag management
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.FEATURE_FLAGS);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Feature flag management requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock feature flag update (in real scenario, this would update database)
      logger.info('Feature flag updated', {
        adminId: user.id,
        flagId,
        updateData,
        isSuperAdmin: user.roles.includes(UserRole.SUPER_ADMIN)
      });

      return {
        success: true,
        message: 'Feature flag updated successfully',
        data: {
          flagId,
          updatedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Update feature flag failed', { error, userId: user.id, flagId });
      throw error;
    }
  }

  /**
   * Get system health (Pro feature)
   */
  static async getSystemHealth(user: SessionUser): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can view system health');
      }

      // Check Pro access for system monitoring
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.SYSTEM_MONITORING);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'System monitoring requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Mock system health data (in real scenario, this would be fetched from actual monitoring)
      const systemHealth = {
        services: [
          {
            name: 'auth-service',
            status: 'HEALTHY',
            responseTime: 45,
            uptime: 99.9
          },
          {
            name: 'buyer-service',
            status: 'HEALTHY',
            responseTime: 52,
            uptime: 99.8
          },
          {
            name: 'seller-service',
            status: 'HEALTHY',
            responseTime: 48,
            uptime: 99.9
          },
          {
            name: 'payment-service',
            status: 'DEGRADED',
            responseTime: 120,
            uptime: 99.5
          }
        ],
        database: {
          status: 'HEALTHY',
          connections: 45,
          queriesPerSecond: 1250
        },
        cache: {
          status: 'HEALTHY',
          hitRate: 92.5,
          memoryUsage: 75.2
        },
        overallStatus: 'DEGRADED'
      };

      return {
        success: true,
        message: 'System health retrieved successfully',
        data: {
          systemHealth
        }
      };
    } catch (error) {
      logger.error('Get system health failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Search users
   */
  static async searchUsers(user: SessionUser, query: string, filters?: any): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can search users');
      }

      // Mock user search (in real scenario, this would use database search)
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } }
          ],
          ...(filters?.status && { status: filters.status }),
          ...(filters?.isPro !== undefined && { isPro: filters.isPro })
        },
        take: 20,
        select: {
          id: true,
          email: true,
          name: true,
          roles: true,
          isPro: true,
          status: true,
          createdAt: true
        }
      });

      return {
        success: true,
        message: 'User search completed successfully',
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            roles: user.roles,
            isPro: user.isPro,
            status: user.status,
            createdAt: user.createdAt.toISOString()
          })),
          total: users.length
        }
      };
    } catch (error) {
      logger.error('Search users failed', { error, userId: user.id, query });
      throw error;
    }
  }

  /**
   * Get admin dashboard summary
   */
  static async getDashboardSummary(user: SessionUser): Promise<AdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Admins can view dashboard summary');
      }

      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { status: 'ACTIVE' }
      });
      const proUsers = await prisma.user.count({
        where: { isPro: true, status: 'ACTIVE' }
      });

      // Mock additional metrics
      const todaySignups = 25;
      const todayRevenue = 45000;
      const pendingApprovals = 12;

      return {
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: {
          summary: {
            totalUsers,
            activeUsers,
            proUsers,
            todaySignups,
            todayRevenue,
            pendingApprovals,
            conversionRate: proUsers > 0 ? Math.round((proUsers / activeUsers) * 10000) / 100 : 0
          }
        }
      };
    } catch (error) {
      logger.error('Get dashboard summary failed', { error, userId: user.id });
      throw error;
    }
  }
}
