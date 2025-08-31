// services/auth-service/src/services/session.service.ts
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { sanitizeIP } from '../middlewares/ipExtractor';
import { SessionManager } from '@msmebazaar/shared/session';

const prisma = new PrismaClient();

export interface SessionData {
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}

export interface SessionInfo {
  id: string;
  userId: string;
  sessionToken: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
}

export class SessionService {
  /**
   * Create a new session for a user
   */
  static async createSession(data: SessionData): Promise<SessionInfo> {
    try {
      const session = await prisma.session.create({
        data: {
          userId: data.userId,
          sessionToken: data.sessionToken,
          ipAddress: data.ipAddress ? sanitizeIP(data.ipAddress) : null,
          userAgent: data.userAgent || null,
          expiresAt: data.expiresAt,
        },
      });

      logger.info('Session created successfully', {
        sessionId: session.id,
        userId: data.userId,
        ipAddress: data.ipAddress,
      });

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      };
    } catch (error) {
      logger.error('Failed to create session', { error, userId: data.userId });
      throw error;
    }
  }

  /**
   * Get session by token and verify it's valid
   */
  static async getSessionByToken(sessionToken: string): Promise<SessionInfo | null> {
    try {
      const session = await prisma.session.findUnique({
        where: { sessionToken },
      });

      if (!session) {
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await this.deleteSession(session.id);
        return null;
      }

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      };
    } catch (error) {
      logger.error('Failed to get session by token', { error, sessionToken });
      throw error;
    }
  }

  /**
   * Get all active sessions for a user
   */
  static async getUserSessions(userId: string): Promise<SessionInfo[]> {
    try {
      const sessions = await prisma.session.findMany({
        where: {
          userId,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return sessions.map((session: any) => ({
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      }));
    } catch (error) {
      logger.error('Failed to get user sessions', { error, userId });
      throw error;
    }
  }

  /**
   * Update session IP address and user agent
   */
  static async updateSessionInfo(
    sessionId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<SessionInfo | null> {
    try {
      const session = await prisma.session.update({
        where: { id: sessionId },
        data: {
          ipAddress: ipAddress ? sanitizeIP(ipAddress) : undefined,
          userAgent: userAgent || undefined,
        },
      });

      return {
        id: session.id,
        userId: session.userId,
        sessionToken: session.sessionToken,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      };
    } catch (error) {
      logger.error('Failed to update session info', { error, sessionId });
      throw error;
    }
  }

  /**
   * Delete a specific session
   */
  static async deleteSession(sessionId: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { id: sessionId },
      });

      logger.info('Session deleted successfully', { sessionId });
    } catch (error) {
      logger.error('Failed to delete session', { error, sessionId });
      throw error;
    }
  }

  /**
   * Delete session by token
   */
  static async deleteSessionByToken(sessionToken: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { sessionToken },
      });

      logger.info('Session deleted by token successfully', { sessionToken });
    } catch (error) {
      logger.error('Failed to delete session by token', { error, sessionToken });
      throw error;
    }
  }

  /**
   * Delete all sessions for a user
   */
  static async deleteAllUserSessions(userId: string): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: { userId },
      });

      logger.info('All user sessions deleted successfully', { userId });
    } catch (error) {
      logger.error('Failed to delete all user sessions', { error, userId });
      throw error;
    }
  }

  /**
   * Clean up expired sessions
   */
  static async cleanupExpiredSessions(): Promise<number> {
    try {
      const result = await prisma.session.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });

      logger.info('Expired sessions cleaned up', { count: result.count });
      return result.count;
    } catch (error) {
      logger.error('Failed to cleanup expired sessions', { error });
      throw error;
    }
  }

  /**
   * Get session statistics
   */
  static async getSessionStats(): Promise<{
    totalSessions: number;
    activeSessions: number;
    expiredSessions: number;
  }> {
    try {
      const [totalSessions, activeSessions, expiredSessions] = await Promise.all([
        prisma.session.count(),
        prisma.session.count({
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
        }),
        prisma.session.count({
          where: {
            expiresAt: {
              lt: new Date(),
            },
          },
        }),
      ]);

      return {
        totalSessions,
        activeSessions,
        expiredSessions,
      };
    } catch (error) {
      logger.error('Failed to get session stats', { error });
      throw error;
    }
  }

  /**
   * Validate session using shared session manager
   */
  static async validateSession(sessionToken: string): Promise<boolean> {
    try {
      const session = await this.getSessionByToken(sessionToken);
      return session !== null;
    } catch (error) {
      logger.error('Session validation failed', { error, sessionToken });
      return false;
    }
  }

  /**
   * Get session info for audit purposes
   */
  static async getSessionAuditInfo(sessionToken: string): Promise<{
    sessionInfo: SessionInfo | null;
    isValid: boolean;
    lastActivity: Date | null;
  }> {
    try {
      const session = await this.getSessionByToken(sessionToken);
      const isValid = session !== null;
      
      return {
        sessionInfo: session,
        isValid,
        lastActivity: session?.createdAt || null,
      };
    } catch (error) {
      logger.error('Failed to get session audit info', { error, sessionToken });
      return {
        sessionInfo: null,
        isValid: false,
        lastActivity: null,
      };
    }
  }
}
