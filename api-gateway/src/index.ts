import express from "express";

import routes from "./routes/serviceRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import recommendationProxy from "./routes/recommendation-proxy";
import matchmakingProxy from './routes/matchmaking-proxy';
import paymentProxyRouter from "./routes/payment-proxy";
import authProxyRouter from "./routes/auth-proxy";
import buyerProxyRouter from "./routes/buyer-proxy";
import sellerProxyRouter from "./routes/seller-proxy";
import adminProxyRouter from "./routes/admin-proxy";
import superadminProxyRouter from "./routes/superadmin-proxy";
import investorProxyRouter from "./routes/investor-proxy";
import loanProxyRouter from "./routes/loan-proxy";
import agentProxyRouter from "./routes/agent-proxy";
import { jwtMw } from "@shared/auth";    // Import shared JWT middleware
import { Config } from "./config";

const app = express();

// Attach JWT middleware once globally to verify tokens and attach user info
app.use(jwtMw(Config.jwtSecret, true));  // 'true' means reject unauthorized immediately

app.use("/api", routes);
app.use("/api/recommendations", recommendationProxy);
app.use('/api/matchmaking', matchmakingProxy);
app.use(paymentProxyRouter);
app.use(authProxyRouter);
app.use(buyerProxyRouter);
app.use(sellerProxyRouter);
app.use(adminProxyRouter);
app.use(superadminProxyRouter);
app.use(investorProxyRouter);
app.use(loanProxyRouter);
app.use(agentProxyRouter);

app.use(errorHandler);

app.listen(process.env.GATEWAY_PORT || 3000, () => {
  console.log(`API Gateway running on port ${process.env.GATEWAY_PORT || 6000}`);
});
