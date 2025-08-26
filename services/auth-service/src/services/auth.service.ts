import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { Config } from '../config/env';
import { TokenManager } from '../utils/tokenManager';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../utils/logger';
import { UserRole } from '@shared/types/feature';
import { SessionUser, LoginRequest, RegisterRequest, AuthTokens } from '@shared/types/user';

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

export class AuthService {
  /**
   * Register a new user with basic role assignment
   */
  static async registerUser(data: RegisterRequest): Promise<AuthServiceResponse> {
    try {
      const { email, password, name } = data;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 409);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, Config.BCRYPT_ROUNDS);

      // Create user with default role (BUYER)
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          isPro: false,
          roles: {
            create: {
              name: UserRole.BUYER
            }
          }
        },
        include: {
          roles: true
        }
      });

      logger.info('User registered successfully', { userId: user.id, email });

      return {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            isPro: user.isPro,
            roles: user.roles.map(r => r.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Registration failed', { error, email: data.email });
      throw error;
    }
  }

  /**
   * Authenticate user and generate tokens
   */
  static async loginUser(data: LoginRequest): Promise<AuthServiceResponse> {
    try {
      const { email, password } = data;

      // Find user with roles
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          roles: true
        }
      });

      if (!user || !await bcrypt.compare(password, user.password)) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const tokenPayload: SessionUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        isPro: user.isPro,
        onboardedProAt: user.onboardedProAt?.toISOString(),
        roles: user.roles.map(r => r.name as UserRole),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      };

      const { accessToken, refreshToken } = TokenManager.generateTokens(tokenPayload);

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      logger.info('User logged in successfully', { userId: user.id, email });

      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: tokenPayload
        }
      };
    } catch (error) {
      logger.error('Login failed', { error, email: data.email });
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
          onboardedProAt: new Date()
        },
        include: {
          roles: true
        }
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
            roles: user.roles.map(r => r.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Pro upgrade failed', { error, userId });
      throw error;
    }
  }

  /**
   * Add role to user (admin function)
   */
  static async addUserRole(userId: string, role: UserRole): Promise<AuthServiceResponse> {
    try {
      const existingRole = await prisma.userRole.findFirst({
        where: {
          userId,
          name: role
        }
      });

      if (existingRole) {
        throw new AppError('User already has this role', 409);
      }

      await prisma.userRole.create({
        data: {
          userId,
          name: role
        }
      });

      logger.info('Role added to user', { userId, role });

      return {
        success: true,
        message: `Role ${role} added successfully`
      };
    } catch (error) {
      logger.error('Add role failed', { error, userId, role });
      throw error;
    }
  }

  /**
   * Remove role from user (admin function)
   */
  static async removeUserRole(userId: string, role: UserRole): Promise<AuthServiceResponse> {
    try {
      const deletedRole = await prisma.userRole.deleteMany({
        where: {
          userId,
          name: role
        }
      });

      if (deletedRole.count === 0) {
        throw new AppError('User does not have this role', 404);
      }

      logger.info('Role removed from user', { userId, role });

      return {
        success: true,
        message: `Role ${role} removed successfully`
      };
    } catch (error) {
      logger.error('Remove role failed', { error, userId, role });
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
          roles: true
        }
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
            roles: user.roles.map(r => r.name as UserRole),
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get user profile failed', { error, userId });
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<AuthServiceResponse> {
    try {
      // Verify refresh token exists and is valid
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            include: {
              roles: true
            }
          }
        }
      });

      if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw new AppError('Invalid or expired refresh token', 401);
      }

      // Generate new tokens
      const tokenPayload: SessionUser = {
        id: tokenRecord.user.id,
        email: tokenRecord.user.email,
        name: tokenRecord.user.name,
        isPro: tokenRecord.user.isPro,
        onboardedProAt: tokenRecord.user.onboardedProAt?.toISOString(),
        roles: tokenRecord.user.roles.map(r => r.name as UserRole),
        createdAt: tokenRecord.user.createdAt.toISOString(),
        updatedAt: tokenRecord.user.updatedAt.toISOString()
      };

      const { accessToken, refreshToken: newRefreshToken } = TokenManager.generateTokens(tokenPayload);

      // Update refresh token
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      return {
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      };
    } catch (error) {
      logger.error('Token refresh failed', { error });
      throw error;
    }
  }

  /**
   * Logout user (invalidate refresh token)
   */
  static async logout(refreshToken: string): Promise<AuthServiceResponse> {
    try {
      await prisma.refreshToken.delete({
        where: { token: refreshToken }
      });

      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      logger.error('Logout failed', { error });
      throw error;
    }
  }
}
