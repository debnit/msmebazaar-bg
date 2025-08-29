import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { getSessionUser } from '@msmebazaar/shared/auth';
import { logger } from '../utils/logger';

export const getUserManagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { page = 1, limit = 20 } = req.query;

    const result = await AdminService.getUserManagement(user, Number(page), Number(limit));

    res.json(result);
  } catch (error) {
    logger.error('Get user management controller error', { error });
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { userId } = req.params;
    const { status } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await AdminService.updateUserStatus(user, userId, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update user status controller error', { error });
    next(error);
  }
};

export const getBasicAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AdminService.getBasicAnalytics(user);

    res.json(result);
  } catch (error) {
    logger.error('Get basic analytics controller error', { error });
    next(error);
  }
};

export const getAdvancedAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AdminService.getAdvancedAnalytics(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get advanced analytics controller error', { error });
    next(error);
  }
};

export const getFeatureFlags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AdminService.getFeatureFlags(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get feature flags controller error', { error });
    next(error);
  }
};

export const updateFeatureFlag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { flagId } = req.params;
    const updateData = req.body;

    if (!flagId) {
      return res.status(400).json({ error: 'Flag ID is required' });
    }

    const result = await AdminService.updateFeatureFlag(user, flagId, updateData);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update feature flag controller error', { error });
    next(error);
  }
};

export const getSystemHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AdminService.getSystemHealth(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get system health controller error', { error });
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { query, filters } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await AdminService.searchUsers(user, query as string, filters as any);

    res.json(result);
  } catch (error) {
    logger.error('Search users controller error', { error });
    next(error);
  }
};

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AdminService.getDashboardSummary(user);

    res.json(result);
  } catch (error) {
    logger.error('Get dashboard summary controller error', { error });
    next(error);
  }
};
