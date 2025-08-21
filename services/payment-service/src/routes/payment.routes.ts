import { createRazorpayOrderController } from "../controllers/payment.controller";
import { requireAuth } from "../middlewares/auth";
import { requireFeature } from "../middlewares/featureGating";
import { Feature } from "../../../../../shared/config/featureFlagTypes";
import { razorpayWebhookController } from "../controllers/payment.controller";


router.post(
  "/razorpay/order",
  requireAuth,
  requireFeature(Feature.PAYMENTS),
  createRazorpayOrderController
);

router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }), // razorpay requires raw body
  razorpayWebhookController
);

// In payment.routes.ts
export default router;
