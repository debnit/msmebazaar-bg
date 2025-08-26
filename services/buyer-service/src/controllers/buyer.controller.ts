import { Request, Response, NextFunction } from 'express';
import { BuyerService, SearchFilters } from '../services/buyer.service';
import { getSessionUser } from '@shared/auth';
import { logger } from '../utils/logger';

export const getBuyerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await BuyerService.getBuyerProfile(user);
    
    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get buyer profile controller error', { error });
    next(error);
  }
};

export const updateBuyerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const profileData = req.body;
    const result = await BuyerService.updateBuyerProfile(user, profileData);
    
    res.json(result);
  } catch (error) {
    logger.error('Update buyer profile controller error', { error });
    next(error);
  }
};

// Listings
export const browseListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { limit = 20 } = req.query;
    const result = await BuyerService.browseListings(user, Number(limit));
    res.json(result);
  } catch (error) {
    logger.error('Browse listings controller error', { error });
    next(error);
  }
};

export const getListingDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { id } = req.params;
    const result = await BuyerService.getListingDetails(user, id);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (error) {
    logger.error('Get listing details controller error', { error });
    next(error);
  }
};

// Search
export const basicSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { query, limit = 20 } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await BuyerService.basicSearch(user, query as string, Number(limit));
    
    res.json(result);
  } catch (error) {
    logger.error('Basic search controller error', { error });
    next(error);
  }
};

export const advancedSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { query, filters, limit = 50 } = req.body;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await BuyerService.advancedSearch(user, query, filters as SearchFilters, Number(limit));
    
    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Advanced search controller error', { error });
    next(error);
  }
};

// GET variant for advanced search for frontend compatibility
export const advancedSearchGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { query = '', limit = 50, ...filterQs } = req.query as any;
    const filters = filterQs as unknown as SearchFilters;
    const result = await BuyerService.advancedSearch(user, String(query), filters, Number(limit));
    if (!result.success && result.data?.upgradeRequired) return res.status(403).json(result);
    res.json(result);
  } catch (error) {
    logger.error('Advanced search (GET) controller error', { error });
    next(error);
  }
};

// Communication
export const contactSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { sellerId, message } = req.body;
    
    if (!sellerId || !message) {
      return res.status(400).json({ error: 'Seller ID and message are required' });
    }

    const result = await BuyerService.contactSeller(user, sellerId, message);
    
    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Contact seller controller error', { error });
    next(error);
  }
};

export const getMessageHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { limit = 50 } = req.query;
    const result = await BuyerService.getMessageHistory(user, Number(limit));
    
    res.json(result);
  } catch (error) {
    logger.error('Get message history controller error', { error });
    next(error);
  }
};

export const getMessageHistoryWithSeller = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { sellerId } = req.params;
    const { limit = 50 } = req.query;
    const result = await BuyerService.getMessageHistoryWithSeller(user, sellerId, Number(limit));
    res.json(result);
  } catch (error) {
    logger.error('Get message history (with seller) controller error', { error });
    next(error);
  }
};

// Saved Searches
export const getSavedSearches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await BuyerService.getSavedSearches(user);
    
    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get saved searches controller error', { error });
    next(error);
  }
};

export const saveSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { name, query, filters } = req.body;
    
    if (!name || !query) {
      return res.status(400).json({ error: 'Search name and query are required' });
    }

    const result = await BuyerService.saveSearch(user, name, query, filters);
    
    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Save search controller error', { error });
    next(error);
  }
};

export const deleteSavedSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { searchId } = req.params;
    const result = await BuyerService.deleteSavedSearch(user, searchId);
    res.json(result);
  } catch (error) {
    logger.error('Delete saved search controller error', { error });
    next(error);
  }
};

// Analytics
export const getBuyerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await BuyerService.getBuyerAnalytics(user);
    
    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get buyer analytics controller error', { error });
    next(error);
  }
};

export const getBuyerBasicAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const result = await BuyerService.getBuyerBasicAnalytics(user);
    res.json(result);
  } catch (error) {
    logger.error('Get buyer basic analytics controller error', { error });
    next(error);
  }
};
