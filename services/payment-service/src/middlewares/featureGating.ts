import { Request, Response, NextFunction } from "express";
import { Feature } from "../../../shared/config/featureFlagTypes";
import { canUserAccessFeature } from "../../../api-gateway/src/utils/featureAccess";
import { getSessionUser } from "../../../shared/auth";

export function requireFeature(feature: Feature) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: "Authentication required" });

    const hasAccess = canUserAccessFeature(feature, {
      role: user.roles?.[0] || "",
      isPro: user.isPro || false,
      userId: user.id,
    });

    if (!hasAccess) {
      return res.status(403).json({ error: `Feature access to ${feature} denied` });
    }
    next();
  };
}
