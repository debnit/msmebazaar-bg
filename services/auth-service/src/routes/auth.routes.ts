import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateBody } from '@msmebazaar/shared/middleware/validation.middleware';
import { 
  registerSchema, 
  loginSchema, 
  refreshTokenSchema,
  changePasswordSchema,
  verifyEmailSchema
} from '@msmebazaar/shared/validation/auth.schema';
import { authRateLimiter, registerRateLimiter, refreshTokenRateLimiter } from '../middlewares/rateLimiter';
import { jwtMw } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { extractClientIP } from '../middlewares/ipExtractor';
//import { validateRequest } from '@/middlewares/validateRequest';

const router = Router();

// Apply IP extraction middleware to all routes
router.use(extractClientIP);

// Public routes
router.post(
  '/register',
  registerRateLimiter,
  validateBody(registerSchema),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  refreshTokenRateLimiter,
  validateBody(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  '/logout',
  validateBody(refreshTokenSchema),
  authController.logout
);

router.post(
  '/verify-email',
  validateBody(verifyEmailSchema),
  authController.verifyEmail
);

// Protected routes
router.use(jwtMw(process.env.JWT_SECRET || 'your-super-secret-key', true));

router.get(
  '/profile',
  authController.getUserProfile
);

router.post(
  '/upgrade-pro',
  authController.upgradeToPro
);

router.post(
  '/change-password',
  validateBody(changePasswordSchema),
  authController.changePassword
);

// Session management routes
router.get(
  '/sessions',
  authController.getUserSessions
);

router.delete(
  '/sessions',
  authController.revokeAllSessions
);

// Admin routes
router.post(
  '/add-role',
  requireRole(UserRole.ADMIN, UserRole.ADMIN),
  authController.addUserRole
);

router.post(
  '/remove-role',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  authController.removeUserRole
);

export default router;
