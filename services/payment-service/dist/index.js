"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/payments", payment_routes_1.default);
app.get("/health", (_, res) => res.send("OK"));
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Payment service running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map