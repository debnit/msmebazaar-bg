import { Request, Response, NextFunction } from 'express';
import { InvestorService } from '../services/investor.service';
import { getSessionUser } from '@msmebazaar/shared/auth';
import { logger } from '../utils/logger';

export const browseOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const filters = req.query;

    const result = await InvestorService.browseOpportunities(user, filters);

    res.json(result);
  } catch (error) {
    logger.error('Browse opportunities controller error', { error });
    next(error);
  }
};

export const getEarlyAccessOpportunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await InvestorService.getEarlyAccessOpportunities(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get early access opportunities controller error', { error });
    next(error);
  }
};

export const getOpportunityDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { opportunityId } = req.params;

    if (!opportunityId) {
      return res.status(400).json({ error: 'Opportunity ID is required' });
    }

    const result = await InvestorService.getOpportunityDetails(user, opportunityId);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get opportunity details controller error', { error });
    next(error);
  }
};

export const expressInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { opportunityId } = req.params;
    const { amount, notes } = req.body;

    if (!opportunityId) {
      return res.status(400).json({ error: 'Opportunity ID is required' });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid investment amount is required' });
    }

    const result = await InvestorService.expressInterest(user, opportunityId, amount, notes);

    res.status(201).json(result);
  } catch (error) {
    logger.error('Express interest controller error', { error });
    next(error);
  }
};

export const getInvestorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await InvestorService.getInvestorProfile(user);

    res.json(result);
  } catch (error) {
    logger.error('Get investor profile controller error', { error });
    next(error);
  }
};

export const updateInvestorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updateData = req.body;

    const result = await InvestorService.updateInvestorProfile(user, updateData);

    res.json(result);
  } catch (error) {
    logger.error('Update investor profile controller error', { error });
    next(error);
  }
};

export const getInvestorAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await InvestorService.getInvestorAnalytics(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get investor analytics controller error', { error });
    next(error);
  }
};

export const getDirectChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await InvestorService.getDirectChats(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get direct chats controller error', { error });
    next(error);
  }
};

export const getInvestmentHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await InvestorService.getInvestmentHistory(user);

    res.json(result);
  } catch (error) {
    logger.error('Get investment history controller error', { error });
    next(error);
  }
};
