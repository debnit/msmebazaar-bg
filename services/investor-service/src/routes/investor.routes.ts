import { Router } from 'express';
import * as investorController from '../controllers/investor.controller';
import { jwtMw } from '@shared/auth';
import { requireRole } from '@shared/middleware/auth';
import { UserRole } from '@shared/types/feature';
import { addUserCapabilities } from '@shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Investors
router.use(requireRole(UserRole.INVESTOR));

// Add user capabilities to request
router.use(addUserCapabilities);

// Investor profile routes
router.get('/profile', investorController.getInvestorProfile);
router.put('/profile', investorController.updateInvestorProfile);

// Opportunity browsing routes
router.get('/opportunities', investorController.browseOpportunities);
router.get('/opportunities/early-access', investorController.getEarlyAccessOpportunities);
router.get('/opportunities/:opportunityId', investorController.getOpportunityDetails);
router.post('/opportunities/:opportunityId/interest', investorController.expressInterest);

// Analytics routes
router.get('/analytics', investorController.getInvestorAnalytics);

// Pro features routes
router.get('/chats', investorController.getDirectChats);

// Investment history routes
router.get('/investments', investorController.getInvestmentHistory);

export default router;
