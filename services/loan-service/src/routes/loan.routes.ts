import { Router } from 'express';
import * as loanController from '../controllers/loan.controller';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { addUserCapabilities } from '@msmebazaar/shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for MSME Owners
router.use(requireRole(UserRole.MSME_OWNER));

// Add user capabilities to request
router.use(addUserCapabilities);

// Loan application routes
router.post('/applications', loanController.createLoanApplication);
router.get('/applications', loanController.getUserLoanApplications);
router.get('/applications/:applicationId', loanController.getLoanApplicationDetails);
router.post('/applications/:applicationId/submit', loanController.submitLoanApplication);
router.post('/applications/:applicationId/documents', loanController.uploadDocuments);

// Loan offers and valuation routes (Pro features)
router.get('/applications/:applicationId/offers', loanController.getLoanOffers);
router.get('/business-valuation', loanController.getBusinessValuation);

// Loan eligibility calculator (basic feature)
router.post('/eligibility', loanController.calculateLoanEligibility);

export default router;
