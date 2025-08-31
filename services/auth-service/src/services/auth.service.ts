import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Config } from '../config/env';
import { TokenManager } from '../utils/tokenManager';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { UserRole } from '@msmebazaar/types/feature';
import { SessionUser, LoginRequest, RegisterRequest, AuthTokens } from '@msmebazaar/types/user';
import { SessionService } from './session.service';
import { getClientIP } from '../middlewares/ipExtractor';

const prisma = new PrismaClient();

export interface AuthServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UserWithRoles {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  onboardedProAt?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginContext {
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  /**
   * Register a new user with proper role assignment
   */
  static async registerUser(data: RegisterRequest, context?: LoginContext): Promise<AuthServiceResponse> {
    try {
      const { email, password, name } = data;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, Config.BCRYPT_ROUNDS);

      // Get or create the default MSME_OWNER role
      const defaultRole = await prisma.role.upsert({
        where: { name: UserRole.MSME_OWNER },
        update: {},
        create: { 
          name: UserRole.MSME_OWNER, 
          description: 'Default MSME Owner Role', 
          permissions: [] 
        },
      });

      // Create user with transaction to ensure data consistency
      const user = await prisma.$transaction(async (tx) => {
        // Create the user
        const newUser = await tx.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
            isPro: false,
          },
        });

        // Assign default role
        await tx.userRole.create({
          data: {
            userId: newUser.id,
            roleId: defaultRole.id,
          },
        });

        // Return user with roles
        return await tx.user.findUnique({
          where: { id: newUser.id },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });
      });

      if (!user) {
        throw new AppError('Failed to create user', 500);
      }

      logger.info('User registered successfully', {
        userId: user.id,
        email,
        ipAddress: context?.ipAddress,
      });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            roles: user.roles.map(r => r.role.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        },
      };
    } catch (error) {
      logger.error('Registration failed', {
        error,
        email: data.email,
        ipAddress: context?.ipAddress,
      });
      throw error;
    }
  }

  /**
   * Authenticate user and generate tokens
   */
  static async loginUser(data: LoginRequest, context?: LoginContext): Promise<AuthServiceResponse> {
    try {
      const { email, password } = data;

      // Find user with roles
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new AppError('Invalid credentials', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new AppError('Account is deactivated', 403);
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate tokens
      const tokenPayload: SessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isPro: user.isPro,
        onboardedProAt: user.onboardedProAt?.toISOString(),
        roles: user.roles.map(r => r.role.name as UserRole),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      };

      const { accessToken, refreshToken } = TokenManager.generateTokens(tokenPayload);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      // Create session with IP tracking
      await SessionService.createSession({
        userId: user.id,
        sessionToken: refreshToken,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });

      logger.info('User logged in successfully', { 
        userId: user.id, 
        email,
        ipAddress: context?.ipAddress,
      });

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: tokenPayload,
        },
      };
    } catch (error) {
      logger.error('Login failed', { 
        error, 
        email: data.email,
        ipAddress: context?.ipAddress,
      });
      throw error;
    }
  }

  /**
   * Upgrade user to Pro subscription
   */
  static async upgradeToPro(userId: string): Promise<AuthServiceResponse> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          isPro: true,
          onboardedProAt: new Date(),
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      logger.info('User upgraded to Pro', { userId });

      return {
        success: true,
        message: 'Successfully upgraded to Pro',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            onboardedProAt: user.onboardedProAt?.toISOString(),
            roles: user.roles.map(r => r.role.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        },
      };
    } catch (error) {
      logger.error('Pro upgrade failed', { error, userId });
      throw error;
    }
  }

  /**
   * Add role to user (admin function)
   */
  static async addUserRole(userId: string, roleName: UserRole): Promise<AuthServiceResponse> {
    try {
      // Get or create the role
      const role = await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { 
          name: roleName, 
          description: `${roleName} Role`, 
          permissions: [] 
        },
      });

      // Check if user already has this role
      const existingUserRole = await prisma.userRole.findFirst({
        where: {
          userId,
          roleId: role.id,
        },
      });

      if (existingUserRole) {
        throw new AppError('User already has this role', 409);
      }

      // Add role to user
      await prisma.userRole.create({
        data: {
          userId,
          roleId: role.id,
        },
      });

      // Get updated user with roles
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      logger.info('Role added to user', { userId, role: roleName });

      return {
        success: true,
        message: 'Role added successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            onboardedProAt: user.onboardedProAt?.toISOString(),
            roles: user.roles.map(r => r.role.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        },
      };
    } catch (error) {
      logger.error('Add user role failed', { error, userId, role: roleName });
      throw error;
    }
  }

  /**
   * Remove role from user (admin function)
   */
  static async removeUserRole(userId: string, roleName: UserRole): Promise<AuthServiceResponse> {
    try {
      // Find the role
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        throw new AppError('Role not found', 404);
      }

      // Find user role association
      const userRole = await prisma.userRole.findFirst({
        where: {
          userId,
          roleId: role.id,
        },
      });

      if (!userRole) {
        throw new AppError('User does not have this role', 404);
      }

      // Prevent removing the last role (user must have at least one role)
      const userRoleCount = await prisma.userRole.count({
        where: { userId },
      });

      if (userRoleCount <= 1) {
        throw new AppError('Cannot remove the last role from user', 400);
      }

      await prisma.userRole.delete({
        where: { id: userRole.id },
      });

      logger.info('Role removed from user', { userId, role: roleName });

      return {
        success: true,
        message: 'Role removed successfully',
      };
    } catch (error) {
      logger.error('Remove user role failed', { error, userId, role: roleName });
      throw error;
    }
  }

  /**
   * Get user profile with roles
   */
  static async getUserProfile(userId: string): Promise<AuthServiceResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          profile: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return {
        success: true,
        message: 'User profile retrieved successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            onboardedProAt: user.onboardedProAt?.toISOString(),
            roles: user.roles.map(r => r.role.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
          profile: user.profile ? {
            id: user.profile.id,
            phone: user.profile.phone,
            avatarUrl: user.profile.avatarUrl,
            bio: user.profile.bio,
            address: user.profile.address,
            socialLinks: user.profile.socialLinks,
            createdAt: user.profile.createdAt.toISOString(),
            updatedAt: user.profile.updatedAt.toISOString(),
          } : null,
        },
      };
    } catch (error) {
      logger.error('Get user profile failed', { error, userId });
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string, context?: LoginContext): Promise<AuthServiceResponse> {
    try {
      // Verify refresh token exists and is valid
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          },
        },
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // Check if user is still active
      if (!tokenRecord.user.isActive) {
        throw new AppError('User account is deactivated', 403);
      }

      // Generate new tokens
      const tokenPayload: SessionUser = {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
        isPro: tokenRecord.user.isPro,
        onboardedProAt: tokenRecord.user.onboardedProAt?.toISOString(),
        roles: tokenRecord.user.roles.map(r => r.role.name as UserRole),
        createdAt: tokenRecord.user.createdAt.toISOString(),
        updatedAt: tokenRecord.user.updatedAt.toISOString(),
      };

      const { accessToken, refreshToken: newRefreshToken } = TokenManager.generateTokens(tokenPayload);

      // Update refresh token
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      // Update session with new IP if provided
      const session = await SessionService.getSessionByToken(refreshToken);
      if (session && context?.ipAddress) {
        await SessionService.updateSessionInfo(
          session.id,
          context.ipAddress,
          context.userAgent,
        );
      }

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken,
        },
      };
    } catch (error) {
      logger.error('Token refresh failed', { error });
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token and session)
   */
  static async logout(refreshToken: string): Promise<AuthServiceResponse> {
    try {
      // Delete refresh token
      await prisma.refreshToken.delete({
        where: { token: refreshToken },
      });

      // Delete session
      await SessionService.deleteSessionByToken(refreshToken);

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      logger.error('Logout failed', { error });
      throw error;
    }
  }

  /**
   * Get user sessions
   */
  static async getUserSessions(userId: string): Promise<AuthServiceResponse> {
    try {
      const sessions = await SessionService.getUserSessions(userId);

      return {
        success: true,
        message: 'User sessions retrieved successfully',
        data: { sessions },
      };
    } catch (error) {
      logger.error('Get user sessions failed', { error, userId });
      throw error;
    }
  }

  /**
   * Revoke all user sessions
   */
  static async revokeAllSessions(userId: string): Promise<AuthServiceResponse> {
    try {
      await SessionService.deleteAllUserSessions(userId);
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });

      return {
        success: true,
        message: 'All sessions revoked successfully',
      };
    } catch (error) {
      logger.error('Revoke all sessions failed', { error, userId });
      throw error;
    }
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<AuthServiceResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      if (!await bcrypt.compare(currentPassword, user.password)) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, Config.BCRYPT_ROUNDS);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      logger.info('Password changed successfully', { userId });

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      logger.error('Change password failed', { error, userId });
      throw error;
    }
  }

  /**
   * Verify user email
   */
  static async verifyEmail(token: string): Promise<AuthServiceResponse> {
    try {
      // This would typically involve a separate email verification token table
      // For now, we'll implement a basic version
      const user = await prisma.user.findFirst({
        where: {
          emailVerified: false,
          // In a real implementation, you'd verify against a token table
        },
      });

      if (!user) {
        throw new AppError('Invalid verification token', 400);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });

      logger.info('Email verified successfully', { userId: user.id });

      return {
        success: true,
        message: 'Email verified successfully',
      };
    } catch (error) {
      logger.error('Email verification failed', { error });
      throw error;
    }
  }
}
