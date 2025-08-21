"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = require("../controllers/payment.controller");
const auth_1 = require("../middlewares/auth");
const featureGating_1 = require("../middlewares/featureGating");
const featureFlagTypes_1 = require("../../../../../shared/config/featureFlagTypes");
const payment_controller_2 = require("../controllers/payment.controller");
router.post("/razorpay/order", auth_1.requireAuth, (0, featureGating_1.requireFeature)(featureFlagTypes_1.Feature.PAYMENTS), payment_controller_1.createRazorpayOrderController);
router.post("/razorpay/webhook", express.raw({ type: "application/json" }), // razorpay requires raw body
payment_controller_2.razorpayWebhookController);
//# sourceMappingURL=payment.routes.js.map