// src/services/proxyFactory.ts

import { createProxyMiddleware } from "http-proxy-middleware";
import { IncomingMessage, ClientRequest, ServerResponse } from "http";
import { createCircuitBreaker } from "./circuitBreaker";
import { logger } from "../utils/logger";

export function createServiceProxy(serviceName: string, target: string) {
  const proxy = createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path: string) => path.replace(new RegExp(`^/api/${serviceName}`), ""),
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, _res: ServerResponse) => {
        if ((req as any).id) {
          proxyReq.setHeader("X-Request-ID", (req as any).id);
        }
      },
      error: (
        err: Error,
        req: IncomingMessage,
        res: ServerResponse & { writeHead?: any }
      ) => {
        logger.error({
          msg: "Proxy error",
          serviceName,
          error: err.message,
          requestId: (req as any).id,
        });
        if (typeof res.end === "function") {
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              success: false,
              message: "Bad Gateway",
              requestId: (req as any).id,
            })
          );
        }
      },
    },
  });

  return createCircuitBreaker((req: IncomingMessage, res: ServerResponse) =>
    new Promise<void>((resolve, reject) => {
      proxy(req, res, (err?: Error) => (err ? reject(err) : resolve()));
    })
  );
}
