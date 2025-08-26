import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { jwtMw } from '@shared/auth';
import { requireRole } from '@shared/middleware/auth';
import { UserRole } from '@shared/types/feature';
import { addUserCapabilities } from '@shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Buyers and Sellers
router.use(requireRole(
  UserRole.BUYER,
  UserRole.SELLER,
  UserRole.MSME_OWNER,
  UserRole.INVESTOR,
  UserRole.AGENT
));

// Add user capabilities to request
router.use(addUserCapabilities);

// Payment order routes
router.post('/orders', paymentController.createPaymentOrder);
router.post('/verify', paymentController.verifyPayment);

// Payment history routes
router.get('/history', paymentController.getPaymentHistory);
router.get('/history/basic', paymentController.getBasicPaymentHistory);

// Payment analytics routes (Pro feature)
router.get('/analytics', paymentController.getPaymentAnalytics);

// Payment details and status routes
router.get('/:paymentId', paymentController.getPaymentDetails);
router.put('/:orderId/status', paymentController.updatePaymentStatus);

// Payment methods routes (Pro feature)
router.get('/methods', paymentController.getPaymentMethods);

export default router;
