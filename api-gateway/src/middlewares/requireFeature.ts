// src/middlewares/requireFeature.ts

import { Request, Response, NextFunction } from "express";
import { Feature } from "../../../shared/config/featureFlagTypes";
import { canUserAccessFeature } from "../utils/featureAccess";
import { SessionUser } from "../../../shared/auth";

/**
 * Middleware factory to enforce access to a specific feature.
 * Checks that a logged-in user has permission to use the given feature.
 */
export const requireFeature = (feature: Feature) => {
  return (req: Request & { user?: SessionUser }, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const user = req.user;

    // Check access using your shared feature access utility
    const hasAccess = canUserAccessFeature(feature, {
      role: user.role,
      isPro: user.isPro,
      userId: user.id,
    });

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Feature "${feature}" not enabled or access denied`,
      });
    }

    next();
  };
};
