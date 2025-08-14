import { Router } from "express";
import { verifyJwt } from "../middlewares/auth";
import { correlationId } from "../middlewares/correlation";
import { limiter } from "../middlewares/rateLimiter";
import { requireFeature } from "../middlewares/requireFeature";
import { createServiceProxy } from "../services/proxyFactory";
import { servicesConfig } from "../config/services";
import { featureServiceMap } from "../config/featureServiceMap";

const router = Router();

function createServiceProxyRoute(serviceName: string, serviceUrl: string, authRequired = true) {
  const proxyBreaker = createServiceProxy(serviceName, serviceUrl);

  const featureGate = (req: any, res: any, next: any) => {
    const relPath = `${serviceName}${req.path}`.replace(/^\/+/, "");
    const feature = featureServiceMap[relPath];
    if (feature) {
      return requireFeature(feature)(req, res, next);
    }
    next();
  };

  const chain: any[] = [correlationId, limiter];
  if (authRequired) chain.push(verifyJwt);
  chain.push(featureGate);
  chain.push((req: any, res: any, next: any) =>
    proxyBreaker.fire(req, res).catch(next)
  );

  router.use(`/${serviceName}`, ...chain);
}

createServiceProxyRoute("auth", servicesConfig.auth, false);

Object.entries(servicesConfig).forEach(([name, url]) => {
  if (name !== "auth") createServiceProxyRoute(name, url, true);
});

export default router;
