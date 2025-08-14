// api-gateway/src/middlewares/requireFeature.ts
import { Request, Response, NextFunction } from "express";
import { Feature } from "../../shared/config/featureFlagTypes";
import { canUserAccessFeature } from "../utils/featureAccess";

export const requireFeature = (feature: Feature) => {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    if (!canUserAccessFeature(feature, {
      role: req.user.role,
      isPro: req.user.isPro,
      userId: req.user.id
    })) {
      return res.status(403).json({
        success: false,
        message: `Feature "${feature}" not enabled or access denied`
      });
    }
    next();
  };
};
