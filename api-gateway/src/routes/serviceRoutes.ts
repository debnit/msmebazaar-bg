import { Router } from "express";
import { verifyJwt } from "../middlewares/auth";
import { correlationId } from "../middlewares/correlation";
import { limiter } from "../middlewares/rateLimiter";
import { logRequests } from "../utils/logger";
import { requireFeature } from "../middlewares/requireFeature";
import { createServiceProxy } from "../services/proxyFactory";
import { servicesConfig } from "../config/services";
import { featureServiceMap } from "../config/featureServiceMap";

const router = Router();

function createServiceProxyRoute(serviceName: string, serviceUrl: string, authRequired = true) {
  const proxyBreaker = createServiceProxy(serviceName, serviceUrl);

  const featureGate = (req: any, res: any, next: any) => {
    const key = `${serviceName}${req.path}`.replace(/^\/+/, "").toLowerCase();
    const feature = featureServiceMap[key];
    if (feature) {
      return requireFeature(feature)(req, res, next);
    }
    next();
  };

  const chain: any[] = [
    correlationId,
    logRequests,
    limiter,
    ...(authRequired ? [verifyJwt] : []),
    featureGate,
    (req: any, res: any, next: any) => proxyBreaker.fire(req, res).catch(next)
  ];

  router.use(`/${serviceName}`, ...chain);
}

createServiceProxyRoute("auth", servicesConfig.auth, false);
Object.entries(servicesConfig)
  .filter(([name]) => name !== "auth")
  .forEach(([name, url]) => createServiceProxyRoute(name, url, true));

export default router;
