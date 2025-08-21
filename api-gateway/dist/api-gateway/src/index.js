"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceRoutes_1 = __importDefault(require("./routes/serviceRoutes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const recommendation_proxy_1 = __importDefault(require("./routes/recommendation-proxy"));
const matchmaking_proxy_1 = __importDefault(require("./routes/matchmaking-proxy"));
const payment_proxy_1 = __importDefault(require("./routes/payment-proxy"));
const auth_1 = require("@shared/auth"); // Import shared JWT middleware
const config_1 = require("./config");
const app = (0, express_1.default)();
// Attach JWT middleware once globally to verify tokens and attach user info
app.use((0, auth_1.jwtMw)(config_1.Config.jwtSecret, true)); // 'true' means reject unauthorized immediately
app.use("/api", serviceRoutes_1.default);
app.use("/api/recommendations", recommendation_proxy_1.default);
app.use('/api/matchmaking', matchmaking_proxy_1.default);
app.use(payment_proxy_1.default);
app.use(errorHandler_1.errorHandler);
app.listen(process.env.GATEWAY_PORT || 3000, () => {
    console.log(`API Gateway running on port ${process.env.GATEWAY_PORT || 3000}`);
});
//# sourceMappingURL=index.js.map