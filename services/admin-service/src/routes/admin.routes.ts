import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { addUserCapabilities } from '@msmebazaar/shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Admins and Super Admins
router.use(requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Add user capabilities to request
router.use(addUserCapabilities);

// Dashboard routes
router.get('/dashboard', adminController.getDashboardSummary);

// User management routes
router.get('/users', adminController.getUserManagement);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.get('/users/search', adminController.searchUsers);

// Analytics routes
router.get('/analytics', adminController.getBasicAnalytics);
router.get('/analytics/advanced', adminController.getAdvancedAnalytics);

// Pro features routes
router.get('/feature-flags', adminController.getFeatureFlags);
router.put('/feature-flags/:flagId', adminController.updateFeatureFlag);
router.get('/system-health', adminController.getSystemHealth);

export default router;
