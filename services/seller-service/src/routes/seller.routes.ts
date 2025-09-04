import { Router } from 'express';
import * as sellerController from '../controllers/seller.controller';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { addUserCapabilities } from '@msmebazaar/shared/middleware/featureGate';

const router = Router();

// Apply authentication middleware to all routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

// Apply role-based access control for Sellers
router.use(requireRole(UserRole.SELLER));

// Add user capabilities to request
router.use(addUserCapabilities);

// Seller profile routes
router.get('/profile', sellerController.getSellerProfile);
router.put('/profile', sellerController.updateSellerProfile);

// Listing management routes
router.post('/listings', sellerController.createListing);
router.get('/listings', sellerController.getSellerListings);
router.get('/listings/:listingId', sellerController.getListingDetails);
router.put('/listings/:listingId', sellerController.updateListing);
router.post('/listings/:listingId/publish', sellerController.publishListing);

// Pro features routes
router.post('/listings/:listingId/boost', sellerController.boostListing);

// Analytics routes
router.get('/analytics', sellerController.getSellerAnalytics);
router.get('/analytics/basic', sellerController.getBasicAnalytics);

// Inquiry management routes
router.post('/inquiries/:inquiryId/respond', sellerController.respondToInquiry);

export default router;
