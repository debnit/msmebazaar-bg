import { Request, Response, NextFunction } from 'express';
import { SuperAdminService } from '../services/superadmin.service';
import { getSessionUser } from '@msmebazaar/shared/auth';
import { logger } from '../utils/logger';

export const getSystemWideAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SuperAdminService.getSystemWideAnalytics(user);

    res.json(result);
  } catch (error) {
    logger.error('Get system-wide analytics controller error', { error });
    next(error);
  }
};

export const getUserRoleManagement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { page = 1, limit = 20 } = req.query;

    const result = await SuperAdminService.getUserRoleManagement(user, Number(page), Number(limit));

    res.json(result);
  } catch (error) {
    logger.error('Get user role management controller error', { error });
    next(error);
  }
};

export const updateUserRoles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { userId } = req.params;
    const { roles } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({ error: 'Roles array is required' });
    }

    const result = await SuperAdminService.updateUserRoles(user, userId, roles);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update user roles controller error', { error });
    next(error);
  }
};

export const getSystemConfiguration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SuperAdminService.getSystemConfiguration(user);

    res.json(result);
  } catch (error) {
    logger.error('Get system configuration controller error', { error });
    next(error);
  }
};

export const updateSystemConfiguration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { configId } = req.params;
    const { value } = req.body;

    if (!configId) {
      return res.status(400).json({ error: 'Config ID is required' });
    }

    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const result = await SuperAdminService.updateSystemConfiguration(user, configId, value);

    res.json(result);
  } catch (error) {
    logger.error('Update system configuration controller error', { error });
    next(error);
  }
};

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { page = 1, limit = 50 } = req.query;

    const result = await SuperAdminService.getAuditLogs(user, Number(page), Number(limit));

    res.json(result);
  } catch (error) {
    logger.error('Get audit logs controller error', { error });
    next(error);
  }
};

export const getSystemHealthOverview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SuperAdminService.getSystemHealthOverview(user);

    res.json(result);
  } catch (error) {
    logger.error('Get system health overview controller error', { error });
    next(error);
  }
};

export const createSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ 
        error: 'email, name, and password are required' 
      });
    }

    const result = await SuperAdminService.createSuperAdmin(user, { email, name, password });

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error('Create super admin controller error', { error });
    next(error);
  }
};

export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SuperAdminService.getDashboardSummary(user);

    res.json(result);
  } catch (error) {
    logger.error('Get dashboard summary controller error', { error });
    next(error);
  }
};
