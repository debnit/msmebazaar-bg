import { Router } from 'express';
import * as superadminController from '../controllers/superadmin.controller';
import { jwtMw } from '@shared/auth';
import { requireRole } from '@shared/middleware/auth';
import { UserRole } from '@shared/types/feature';
import { addUserCapabilities } from '@shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Super Admins only
router.use(requireRole(UserRole.SUPER_ADMIN));

// Add user capabilities to request
router.use(addUserCapabilities);

// Dashboard routes
router.get('/dashboard', superadminController.getDashboardSummary);

// System-wide analytics
router.get('/analytics', superadminController.getSystemWideAnalytics);

// User role management routes
router.get('/users/roles', superadminController.getUserRoleManagement);
router.put('/users/:userId/roles', superadminController.updateUserRoles);

// System configuration routes
router.get('/configuration', superadminController.getSystemConfiguration);
router.put('/configuration/:configId', superadminController.updateSystemConfiguration);

// System monitoring routes
router.get('/health', superadminController.getSystemHealthOverview);
router.get('/audit-logs', superadminController.getAuditLogs);

// Super admin management routes
router.post('/admins', superadminController.createSuperAdmin);

export default router;
