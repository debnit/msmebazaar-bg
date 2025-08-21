import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middlewares/auth"; 
import { correlationId } from "../middlewares/correlation";
import { limiter } from "../middlewares/rateLimiter";
import { logRequests } from "../utils/logger";
import { requireFeature } from "../middlewares/requireFeature";
import { createServiceProxy } from "../services/proxyFactory";
import { servicesConfig } from "../config/services";
import { featureServiceMap } from "../config/featureServiceMap";
import { Feature } from "@shared/config/featureFlagTypes";

const router = Router();

const createFeatureGate = (serviceName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Construct feature map key
    const key = `${serviceName}${req.path}`.toLowerCase();
    console.log("[Feature Gate] Computed key:", key);

    const feature = featureServiceMap[key];
    console.log("[Feature Gate] Matched feature:", feature);

    if (feature) {
      return requireFeature(feature)(req, res, next);
    }
    next();
  };
};

function createServiceProxyRoute(
  serviceName: string,
  serviceConfig: { url: string; requiresAuth: boolean }
) {
  const proxyBreaker = createServiceProxy(serviceName, serviceConfig.url);

  const middlewareChain: Array<(req: Request, res: Response, next: NextFunction) => void | Promise<void>> = [
    correlationId,
    logRequests,
    limiter,
    ...(serviceConfig.requiresAuth ? [requireAuth] : []),
    createFeatureGate(serviceName),
    (req, res, next) => {
      proxyBreaker(req, res).catch(next);

    }
  ];

  router.use(`/${serviceName}`, ...middlewareChain);
}

Object.entries(servicesConfig).forEach(([name, config]) => {
  createServiceProxyRoute(name, config);
});

export default router;
