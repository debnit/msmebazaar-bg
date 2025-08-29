import { Router } from 'express';
import * as buyerController from '../controllers/buyer.controller';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { addUserCapabilities } from '@msmebazaar/shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control
router.use(requireRole(UserRole.BUYER));

// Add user capabilities to request
router.use(addUserCapabilities);

// Profile routes
router.get('/profile', buyerController.getBuyerProfile);
router.put('/profile', buyerController.updateBuyerProfile);

// Listing routes
router.get('/listings', buyerController.browseListings);
router.get('/listings/:id', buyerController.getListingDetails);

// Search routes
router.get('/search', buyerController.basicSearch);
router.post('/search/advanced', buyerController.advancedSearch);
router.get('/search/advanced', buyerController.advancedSearchGet);

// Saved searches
router.get('/saved-searches', buyerController.getSavedSearches);
router.post('/saved-searches', buyerController.saveSearch);
router.delete('/saved-searches/:searchId', buyerController.deleteSavedSearch);

// Communication routes
router.post('/contact', buyerController.contactSeller);
router.get('/messages', buyerController.getMessageHistory);
router.get('/messages/:sellerId', buyerController.getMessageHistoryWithSeller);

// Analytics routes
router.get('/analytics', buyerController.getBuyerAnalytics);
router.get('/analytics/basic', buyerController.getBuyerBasicAnalytics);

export default router;
