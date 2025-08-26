import { Request, Response, NextFunction } from 'express';
import { FeatureGatingService } from '../services/featureGating.service';
import { Feature } from '../types/feature';
import { getSessionUser } from '../auth';
import { AppError } from './errorHandler';

/**
 * Middleware to check feature access
 */
export function requireFeature(feature: Feature) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const accessResult = FeatureGatingService.checkFeatureAccess(user, feature);
    
    if (!accessResult.hasAccess) {
      const errorResponse: any = {
        error: accessResult.reason || 'Access denied',
        code: 'FEATURE_ACCESS_DENIED'
      };

      if (accessResult.upgradeRequired) {
        errorResponse.upgradeRequired = true;
        errorResponse.proFeature = true;
        errorResponse.upgradeUrl = '/upgrade-pro';
      }

      return res.status(403).json(errorResponse);
    }

    next();
  };
}

/**
 * Middleware to check service access based on role-service matrix
 */
export function requireService(service: string, isProService: boolean = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const accessResult = FeatureGatingService.checkServiceAccess(user, service, isProService);
    
    if (!accessResult.hasAccess) {
      const errorResponse: any = {
        error: accessResult.reason || 'Service access denied',
        code: 'SERVICE_ACCESS_DENIED'
      };

      if (accessResult.upgradeRequired) {
        errorResponse.upgradeRequired = true;
        errorResponse.proFeature = true;
        errorResponse.upgradeUrl = '/upgrade-pro';
      }

      return res.status(403).json(errorResponse);
    }

    next();
  };
}

/**
 * Middleware to check Pro subscription
 */
export function requirePro(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!user.isPro) {
    return res.status(403).json({
      error: 'Pro subscription required',
      code: 'PRO_REQUIRED',
      upgradeRequired: true,
      upgradeUrl: '/upgrade-pro'
    });
  }

  next();
}

/**
 * Middleware to check if user can upgrade to Pro
 */
export function requireUpgradeable(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  if (!FeatureGatingService.canUpgradeToPro(user)) {
    return res.status(400).json({
      error: 'User is already Pro or cannot upgrade',
      code: 'ALREADY_PRO'
    });
  }

  next();
}

/**
 * Middleware to add user services and features to request
 */
export function addUserCapabilities(req: Request, res: Response, next: NextFunction) {
  const user = getSessionUser(req);
  
  if (user) {
    const services = FeatureGatingService.getUserServices(user);
    const features = FeatureGatingService.getUserFeatures(user);
    const recommendations = FeatureGatingService.getUpgradeRecommendations(user);
    
    req.userCapabilities = {
      services,
      features,
      recommendations,
      canUpgrade: FeatureGatingService.canUpgradeToPro(user)
    };
  }

  next();
}

/**
 * Helper function to get user capabilities from request
 */
export function getUserCapabilities(req: Request) {
  return req.userCapabilities;
}

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      userCapabilities?: {
        services: { basic: string[], pro: string[] };
        features: Feature[];
        recommendations: string[];
        canUpgrade: boolean;
      };
    }
  }
}
