import { Request, Response, NextFunction } from 'express';
import { SellerService } from '../services/seller.service';
import { getSessionUser } from '@shared/auth';
import { logger } from '../utils/logger';

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { title, description, category, price, currency, location, images } = req.body;

    // Validate required fields
    if (!title || !description || !category || !price || !location) {
      return res.status(400).json({ 
        error: 'title, description, category, price, and location are required' 
      });
    }

    const result = await SellerService.createListing(user, {
      title,
      description,
      category,
      price,
      currency,
      location,
      images
    });

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    logger.error('Create listing controller error', { error });
    next(error);
  }
};

export const publishListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { listingId } = req.params;

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const result = await SellerService.publishListing(user, listingId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Publish listing controller error', { error });
    next(error);
  }
};

export const boostListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { listingId } = req.params;

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const result = await SellerService.boostListing(user, listingId);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Boost listing controller error', { error });
    next(error);
  }
};

export const getSellerListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SellerService.getSellerListings(user);

    res.json(result);
  } catch (error) {
    logger.error('Get seller listings controller error', { error });
    next(error);
  }
};

export const getListingDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { listingId } = req.params;

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const result = await SellerService.getListingDetails(user, listingId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get listing details controller error', { error });
    next(error);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { listingId } = req.params;
    const updateData = req.body;

    if (!listingId) {
      return res.status(400).json({ error: 'Listing ID is required' });
    }

    const result = await SellerService.updateListing(user, listingId, updateData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update listing controller error', { error });
    next(error);
  }
};

export const getSellerAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SellerService.getSellerAnalytics(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get seller analytics controller error', { error });
    next(error);
  }
};

export const getBasicAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SellerService.getBasicAnalytics(user);

    res.json(result);
  } catch (error) {
    logger.error('Get basic analytics controller error', { error });
    next(error);
  }
};

export const respondToInquiry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { inquiryId } = req.params;
    const { response } = req.body;

    if (!inquiryId) {
      return res.status(400).json({ error: 'Inquiry ID is required' });
    }

    if (!response) {
      return res.status(400).json({ error: 'Response message is required' });
    }

    const result = await SellerService.respondToInquiry(user, inquiryId, response);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Respond to inquiry controller error', { error });
    next(error);
  }
};

export const getSellerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await SellerService.getSellerProfile(user);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get seller profile controller error', { error });
    next(error);
  }
};

export const updateSellerProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const updateData = req.body;

    const result = await SellerService.updateSellerProfile(user, updateData);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Update seller profile controller error', { error });
    next(error);
  }
};
