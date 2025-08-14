// src/services/proxyFactory.ts
import { createProxyMiddleware } from "http-proxy-middleware";
import { createCircuitBreaker } from "./circuitBreaker";
import { logger } from "../utils/logger";

export function createServiceProxy(serviceName: string, target: string) {
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: path => path.replace(new RegExp(`^/api/${serviceName}`), ""),
    onProxyReq: (proxyReq, req: any) => {
      // Forward correlation ID to downstream services
      if (req.id) proxyReq.setHeader("X-Request-ID", req.id);
    },
    onError: (err, req: any, res) => {
      logger.error({ msg: "Proxy error", serviceName, error: err.message, requestId: req.id });
      res.status(502).json({ success: false, message: "Bad Gateway", requestId: req.id });
    }
  });

  return createCircuitBreaker((req: any, res: any) =>
    new Promise((resolve, reject) => {
      proxy(req, res, err => (err ? reject(err) : resolve(null)));
    })
  );
}
