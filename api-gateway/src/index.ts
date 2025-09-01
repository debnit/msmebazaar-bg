import express from "express";
import cors from "cors";

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
import { jwtMw } from "@msmebazaar/shared/auth";    // Import shared JWT middleware
import { Config } from "./config";



const app = express();

app.use((req, res, next) => {
  console.log(`[Gateway] Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});


// ✅ Allow CORS for frontend (e.g., React at localhost:3000)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// Remove global JWT middleware - apply selectively to protected routes only
 //app.use(jwtMw(Config["jwtSecret"], true));  // ❌ This was causing 401 errors on public routes
app.use(express.json());

app.use("/api", routes);
app.use('/auth',authProxyRouter);  // ✅ Auth routes (login/register) now work without JWT
app.use("/api/recommendations", recommendationProxy);
app.use('/api/matchmaking', matchmakingProxy);
app.use(paymentProxyRouter);
app.use(buyerProxyRouter);
app.use(sellerProxyRouter);
app.use(adminProxyRouter);
app.use(superadminProxyRouter);
app.use(investorProxyRouter);
app.use(loanProxyRouter);
app.use(agentProxyRouter);

app.use((req, res) => {
  console.warn(`[Gateway] No route matched for ${req.method} ${req.originalUrl}`);
  res.status(404).json({ status: 'error', statusCode: 404, message: 'Route / not found' });
});


app.use(errorHandler);

app.listen(process.env["GATEWAY_PORT"] || 7000, () => {
  console.log(`API Gateway running on port ${process.env["GATEWAY_PORT"] || 7000}`);
});

