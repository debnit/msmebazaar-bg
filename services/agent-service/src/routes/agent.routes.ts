import { Router } from 'express';
import * as agentController from '../controllers/agent.controller';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { addUserCapabilities } from '@msmebazaar/shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Agents
router.use(requireRole(UserRole.AGENT));

// Add user capabilities to request
router.use(addUserCapabilities);

// Agent profile routes
router.get('/profile', agentController.getAgentProfile);
router.put('/profile', agentController.updateAgentProfile);

// Deal management routes
router.post('/deals', agentController.createDeal);
router.get('/deals', agentController.getAgentDeals);
router.get('/deals/:dealId', agentController.getDealDetails);
router.put('/deals/:dealId/status', agentController.updateDealStatus);

// Analytics routes
router.get('/analytics', agentController.getAgentAnalytics);
router.get('/analytics/basic', agentController.getBasicAnalytics);

// Pro features routes
router.get('/crm', agentController.getCRMDashboard);

// Commission routes
router.get('/commissions', agentController.getCommissionHistory);

export default router;
