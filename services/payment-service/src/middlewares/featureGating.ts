// ENHANCED PRODUCTION-GRADE FEATURE GATING
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export enum Feature {
  PAYMENT_PROCESSING = "payment_processing",
  REFUND_PROCESSING = "refund_processing", 
  BULK_PAYMENTS = "bulk_payments",
  INTERNATIONAL_PAYMENTS = "international_payments",
  WEBHOOK_MANAGEMENT = "webhook_management",
  PAYMENT_ANALYTICS = "payment_analytics"
}

export interface FeatureContext {
  role: string;
  isPro: boolean;
  userId: string;
  merchantId?: string;
  planType?: string;
}

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
}

export class FeatureAccessService {
  private static featureMatrix: Record<Feature, (context: FeatureContext) => FeatureAccessResult> = {
    [Feature.PAYMENT_PROCESSING]: (context) => ({
      hasAccess: ['admin', 'merchant', 'user'].includes(context.role),
      reason: context.role ? undefined : 'Role required for payment processing'
    }),
    
    [Feature.REFUND_PROCESSING]: (context) => ({
      hasAccess: ['admin', 'merchant'].includes(context.role),
      reason: !['admin', 'merchant'].includes(context.role) ? 'Merchant role required for refunds' : undefined
    }),
    
    [Feature.BULK_PAYMENTS]: (context) => ({
      hasAccess: context.isPro && ['admin', 'merchant'].includes(context.role),
      reason: !context.isPro ? 'Pro subscription required' : 
              !['admin', 'merchant'].includes(context.role) ? 'Merchant role required' : undefined,
      upgradeRequired: !context.isPro
    }),
    
    [Feature.INTERNATIONAL_PAYMENTS]: (context) => ({
      hasAccess: context.isPro && ['admin'].includes(context.role),
      reason: !context.isPro ? 'Pro subscription required' : 
              !['admin'].includes(context.role) ? 'Admin role required' : undefined,
      upgradeRequired: !context.isPro
    }),
    
    [Feature.WEBHOOK_MANAGEMENT]: (context) => ({
      hasAccess: ['admin', 'merchant'].includes(context.role),
      reason: !['admin', 'merchant'].includes(context.role) ? 'Merchant role required' : undefined
    }),
    
    [Feature.PAYMENT_ANALYTICS]: (context) => ({
      hasAccess: context.isPro || ['admin'].includes(context.role),
      reason: !context.isPro && !['admin'].includes(context.role) ? 'Pro subscription or admin role required' : undefined,
      upgradeRequired: !context.isPro && !['admin'].includes(context.role)
    })
  };

  static checkFeatureAccess(feature: Feature, context: FeatureContext): FeatureAccessResult {
    const checker = this.featureMatrix[feature];
    if (!checker) {
      return {
        hasAccess: false,
        reason: `Unknown feature: ${feature}`
      };
    }

    return checker(context);
  }
}

export function requireFeature(feature: Feature) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    
    if (!user) {
      logger.warn('Feature access denied: No authentication', {
        feature,
        ip: req.ip,
        path: req.path
      });
        res.status(401).json({ 
        error: "Authentication required",
        code: "AUTH_REQUIRED"
      }); 
       return;
    }

    const context: FeatureContext = {
      role: user.roles?.[0] || "",
      isPro: user.isPro || false,
      userId: user.id,
    };

    const accessResult = FeatureAccessService.checkFeatureAccess(feature, context);

    if (!accessResult.hasAccess) {
      logger.warn('Feature access denied', {
        userId: user.id,
        feature,
        reason: accessResult.reason,
        userRole: context.role,
        isPro: context.isPro,
        path: req.path
      });

      const responseData: any = {
        error: `Feature access to ${feature} denied`,
        code: "FEATURE_ACCESS_DENIED",
        reason: accessResult.reason
      };

      if (accessResult.upgradeRequired) {
        responseData.upgradeRequired = true;
        responseData.upgradeUrl = `/upgrade?feature=${feature}`;
      }

        res.status(403).json(responseData);
        return;
    }

    logger.info('Feature access granted', {
      userId: user.id,
      feature,
      userRole: context.role,
      isPro: context.isPro,
      path: req.path
    });

    next();
  };
}
// Payment-specific feature gates
export const requirePaymentAccess = requireFeature(Feature.PAYMENT_PROCESSING);
export const requireRefundAccess = requireFeature(Feature.REFUND_PROCESSING);
export const requireBulkPaymentAccess = requireFeature(Feature.BULK_PAYMENTS);
export const requireWebhookAccess = requireFeature(Feature.WEBHOOK_MANAGEMENT);
