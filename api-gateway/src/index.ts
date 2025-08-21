import express from "express";

import routes from "./routes/serviceRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import recommendationProxy from "./routes/recommendation-proxy";
import matchmakingProxy from './routes/matchmaking-proxy';
import paymentProxyRouter from "./routes/payment-proxy";
import { jwtMw } from "@shared/auth";    // Import shared JWT middleware
import { Config } from "./config";

const app = express();

// Attach JWT middleware once globally to verify tokens and attach user info
app.use(jwtMw(Config.jwtSecret, true));  // 'true' means reject unauthorized immediately

app.use("/api", routes);
app.use("/api/recommendations", recommendationProxy);
app.use('/api/matchmaking', matchmakingProxy);
app.use(paymentProxyRouter);

app.use(errorHandler);

app.listen(process.env.GATEWAY_PORT || 3000, () => {
  console.log(`API Gateway running on port ${process.env.GATEWAY_PORT || 3000}`);
});
