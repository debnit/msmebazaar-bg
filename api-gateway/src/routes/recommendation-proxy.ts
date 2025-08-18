import { Router } from "express";
import proxy from "http-proxy-middleware";

const router = Router();
router.use(
  "/recommendations",
  proxy({
    target: "http://recommendation-service:4000",
    changeOrigin: true,
    pathRewrite: { "^/api/recommendations": "" },
  })
);
export default router;
