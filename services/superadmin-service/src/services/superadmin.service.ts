import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@shared/types/user';
import { UserRole } from '@shared/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface SystemWideAnalytics {
  totalUsers: number;
  activeUsers: number;
  proUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
  systemUptime: number;
  averageResponseTime: number;
  errorRate: number;
  userDistribution: {
    buyers: number;
    sellers: number;
    agents: number;
    msmeOwners: number;
    investors: number;
    admins: number;
    superAdmins: number;
  };
  revenueTrends: Array<{
    month: string;
    revenue: number;
    newUsers: number;
    proConversions: number;
  }>;
  systemMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkTraffic: number;
  };
}

export interface UserRoleManagement {
  id: string;
  email: string;
  name: string;
  currentRoles: UserRole[];
  availableRoles: UserRole[];
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  createdAt: string;
  lastLoginAt?: string;
}

export interface SystemConfiguration {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'SECURITY' | 'PERFORMANCE' | 'FEATURES' | 'INTEGRATIONS';
  isEncrypted: boolean;
  updatedBy: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface SuperAdminServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class SuperAdminService {
  /**
   * Get system-wide analytics
   */
  static async getSystemWideAnalytics(user: SessionUser): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can access system-wide analytics');
      }

      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.user.count({
        where: { status: 'ACTIVE' }
      });
      const proUsers = await prisma.user.count({
        where: { isPro: true, status: 'ACTIVE' }
      });

      // Mock system metrics (in real scenario, this would be fetched from monitoring)
      const systemMetrics = {
        cpuUsage: 45.2,
        memoryUsage: 67.8,
        diskUsage: 23.4,
        networkTraffic: 1250.5
      };

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
        }),
        admins: await prisma.user.count({
          where: { roles: { has: UserRole.ADMIN }, status: 'ACTIVE' }
        }),
        superAdmins: await prisma.user.count({
          where: { roles: { has: UserRole.SUPER_ADMIN }, status: 'ACTIVE' }
        })
      };

      // Mock revenue trends
      const revenueTrends = [
        { month: '2024-01', revenue: 1200000, newUsers: 150, proConversions: 25 },
        { month: '2024-02', revenue: 1350000, newUsers: 180, proConversions: 32 },
        { month: '2024-03', revenue: 1500000, newUsers: 200, proConversions: 38 }
      ];

      return {
        success: true,
        message: 'System-wide analytics retrieved successfully',
        data: {
          analytics: {
            totalUsers,
            activeUsers,
            proUsers,
            totalRevenue: 1500000,
            monthlyGrowth: 12.5,
            systemUptime: 99.95,
            averageResponseTime: 45.2,
            errorRate: 0.05,
            userDistribution,
            revenueTrends,
            systemMetrics
          }
        }
      };
    } catch (error) {
      logger.error('Get system-wide analytics failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get user role management list
   */
  static async getUserRoleManagement(user: SessionUser, page: number = 1, limit: number = 20): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can access user role management');
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
          status: true,
          createdAt: true,
          lastLoginAt: true
        }
      });

      const totalUsers = await prisma.user.count();

      return {
        success: true,
        message: 'User role management data retrieved successfully',
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            currentRoles: user.roles,
            availableRoles: Object.values(UserRole),
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
      logger.error('Get user role management failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update user roles
   */
  static async updateUserRoles(user: SessionUser, targetUserId: string, roles: UserRole[]): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can update user roles');
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

      // Prevent removing super admin role from the last super admin
      if (targetUser.roles.includes(UserRole.SUPER_ADMIN) && !roles.includes(UserRole.SUPER_ADMIN)) {
        const superAdminCount = await prisma.user.count({
          where: { roles: { has: UserRole.SUPER_ADMIN } }
        });

        if (superAdminCount <= 1) {
          return {
            success: false,
            message: 'Cannot remove Super Admin role from the last Super Admin'
          };
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: targetUserId },
        data: { roles }
      });

      logger.info('User roles updated', {
        superAdminId: user.id,
        targetUserId,
        newRoles: roles
      });

      return {
        success: true,
        message: 'User roles updated successfully',
        data: {
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            roles: updatedUser.roles
          }
        }
      };
    } catch (error) {
      logger.error('Update user roles failed', { error, userId: user.id, targetUserId });
      throw error;
    }
  }

  /**
   * Get system configuration
   */
  static async getSystemConfiguration(user: SessionUser): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can access system configuration');
      }

      // Mock system configuration (in real scenario, this would be fetched from database)
      const systemConfig = [
        {
          id: 'config-1',
          key: 'JWT_SECRET',
          value: '***ENCRYPTED***',
          description: 'JWT signing secret for authentication',
          category: 'SECURITY',
          isEncrypted: true,
          updatedBy: 'super-admin-1',
          updatedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'config-2',
          key: 'MAX_LOGIN_ATTEMPTS',
          value: '5',
          description: 'Maximum failed login attempts before account lockout',
          category: 'SECURITY',
          isEncrypted: false,
          updatedBy: 'super-admin-1',
          updatedAt: '2024-01-10T00:00:00Z'
        },
        {
          id: 'config-3',
          key: 'CACHE_TTL',
          value: '3600',
          description: 'Cache time-to-live in seconds',
          category: 'PERFORMANCE',
          isEncrypted: false,
          updatedBy: 'super-admin-2',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: 'config-4',
          key: 'RAZORPAY_ENABLED',
          value: 'true',
          description: 'Enable Razorpay payment gateway',
          category: 'INTEGRATIONS',
          isEncrypted: false,
          updatedBy: 'super-admin-1',
          updatedAt: '2024-01-05T00:00:00Z'
        }
      ];

      return {
        success: true,
        message: 'System configuration retrieved successfully',
        data: {
          configuration: systemConfig
        }
      };
    } catch (error) {
      logger.error('Get system configuration failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Update system configuration
   */
  static async updateSystemConfiguration(user: SessionUser, configId: string, value: string): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can update system configuration');
      }

      // Mock system configuration update (in real scenario, this would update database)
      logger.info('System configuration updated', {
        superAdminId: user.id,
        configId,
        value: value.length > 10 ? '***TRUNCATED***' : value
      });

      return {
        success: true,
        message: 'System configuration updated successfully',
        data: {
          configId,
          updatedAt: new Date().toISOString(),
          updatedBy: user.id
        }
      };
    } catch (error) {
      logger.error('Update system configuration failed', { error, userId: user.id, configId });
      throw error;
    }
  }

  /**
   * Get audit logs
   */
  static async getAuditLogs(user: SessionUser, page: number = 1, limit: number = 50): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can access audit logs');
      }

      // Mock audit logs (in real scenario, this would be fetched from database)
      const auditLogs = [
        {
          id: 'log-1',
          userId: 'user-123',
          action: 'USER_ROLE_UPDATED',
          resource: 'USER',
          resourceId: 'user-456',
          details: { oldRoles: ['BUYER'], newRoles: ['BUYER', 'SELLER'] },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: '2024-01-20T10:30:00Z'
        },
        {
          id: 'log-2',
          userId: 'admin-789',
          action: 'USER_STATUS_UPDATED',
          resource: 'USER',
          resourceId: 'user-789',
          details: { oldStatus: 'ACTIVE', newStatus: 'SUSPENDED' },
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          timestamp: '2024-01-20T09:15:00Z'
        }
      ];

      return {
        success: true,
        message: 'Audit logs retrieved successfully',
        data: {
          auditLogs,
          pagination: {
            page,
            limit,
            total: 150,
            totalPages: Math.ceil(150 / limit)
          }
        }
      };
    } catch (error) {
      logger.error('Get audit logs failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get system health overview
   */
  static async getSystemHealthOverview(user: SessionUser): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can access system health overview');
      }

      // Mock system health data (in real scenario, this would be fetched from monitoring)
      const systemHealth = {
        overallStatus: 'HEALTHY',
        services: [
          { name: 'auth-service', status: 'HEALTHY', uptime: 99.9, responseTime: 45 },
          { name: 'buyer-service', status: 'HEALTHY', uptime: 99.8, responseTime: 52 },
          { name: 'seller-service', status: 'HEALTHY', uptime: 99.9, responseTime: 48 },
          { name: 'payment-service', status: 'DEGRADED', uptime: 99.5, responseTime: 120 },
          { name: 'admin-service', status: 'HEALTHY', uptime: 99.9, responseTime: 38 },
          { name: 'agent-service', status: 'HEALTHY', uptime: 99.8, responseTime: 42 }
        ],
        infrastructure: {
          database: { status: 'HEALTHY', connections: 45, queriesPerSecond: 1250 },
          cache: { status: 'HEALTHY', hitRate: 92.5, memoryUsage: 75.2 },
          loadBalancer: { status: 'HEALTHY', requestsPerSecond: 850 },
          storage: { status: 'HEALTHY', usage: 23.4, available: 76.6 }
        },
        alerts: [
          { level: 'WARNING', message: 'Payment service response time increased', timestamp: '2024-01-20T10:00:00Z' },
          { level: 'INFO', message: 'Database backup completed successfully', timestamp: '2024-01-20T09:00:00Z' }
        ]
      };

      return {
        success: true,
        message: 'System health overview retrieved successfully',
        data: {
          systemHealth
        }
      };
    } catch (error) {
      logger.error('Get system health overview failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Create new super admin
   */
  static async createSuperAdmin(user: SessionUser, adminData: { email: string; name: string; password: string }): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can create new Super Admins');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: adminData.email }
      });

      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists'
        };
      }

      // Create new super admin (in real scenario, this would hash password and create user)
      logger.info('New Super Admin created', {
        createdBy: user.id,
        newAdminEmail: adminData.email
      });

      return {
        success: true,
        message: 'Super Admin created successfully',
        data: {
          admin: {
            email: adminData.email,
            name: adminData.name,
            roles: [UserRole.SUPER_ADMIN],
            status: 'ACTIVE'
          }
        }
      };
    } catch (error) {
      logger.error('Create super admin failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get super admin dashboard summary
   */
  static async getDashboardSummary(user: SessionUser): Promise<SuperAdminServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.SUPER_ADMIN)) {
        throw new Error('Only Super Admins can view dashboard summary');
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
      const systemAlerts = 2;

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
            systemAlerts,
            conversionRate: proUsers > 0 ? Math.round((proUsers / activeUsers) * 10000) / 100 : 0,
            systemUptime: 99.95
          }
        }
      };
    } catch (error) {
      logger.error('Get dashboard summary failed', { error, userId: user.id });
      throw error;
    }
  }
}
