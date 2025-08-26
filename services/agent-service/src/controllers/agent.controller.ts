import { Request, Response, NextFunction } from 'express';
import { AgentService } from '../services/agent.service';
import { getSessionUser } from '@shared/auth';
import { logger } from '../utils/logger';

export const createDeal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { buyerId, sellerId, listingId, dealValue, notes } = req.body;

    // Validate required fields
    if (!buyerId || !sellerId || !listingId || !dealValue) {
      return res.status(400).json({ 
        error: 'buyerId, sellerId, listingId, and dealValue are required' 
      });
    }

    const result = await AgentService.createDeal(user, {
      buyerId,
      sellerId,
      listingId,
      dealValue,
      notes
    });

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error('Create deal controller error', { error });
    next(error);
  }
};

export const updateDealStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { dealId } = req.params;
    const { status } = req.body;

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const result = await AgentService.updateDealStatus(user, dealId, status);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update deal status controller error', { error });
    next(error);
  }
};

export const getAgentDeals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getAgentDeals(user);

    res.json(result);
  } catch (error) {
    logger.error('Get agent deals controller error', { error });
    next(error);
  }
};

export const getDealDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { dealId } = req.params;

    if (!dealId) {
      return res.status(400).json({ error: 'Deal ID is required' });
    }

    const result = await AgentService.getDealDetails(user, dealId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get deal details controller error', { error });
    next(error);
  }
};

export const getAgentAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getAgentAnalytics(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get agent analytics controller error', { error });
    next(error);
  }
};

export const getBasicAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getBasicAnalytics(user);

    res.json(result);
  } catch (error) {
    logger.error('Get basic analytics controller error', { error });
    next(error);
  }
};

export const getCRMDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getCRMDashboard(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get CRM dashboard controller error', { error });
    next(error);
  }
};

export const getAgentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getAgentProfile(user);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get agent profile controller error', { error });
    next(error);
  }
};

export const updateAgentProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updateData = req.body;

    const result = await AgentService.updateAgentProfile(user, updateData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update agent profile controller error', { error });
    next(error);
  }
};

export const getCommissionHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await AgentService.getCommissionHistory(user);

    res.json(result);
  } catch (error) {
    logger.error('Get commission history controller error', { error });
    next(error);
  }
};
