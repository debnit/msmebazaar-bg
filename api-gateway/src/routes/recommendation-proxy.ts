import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router: Router = Router();
router.use(
  "/recommendations",
  createProxyMiddleware({

    target: "http://recommendation-service:4000",
    changeOrigin: true,
    pathRewrite: { "^/api/recommendations": "" },
  })
);
export default router;
