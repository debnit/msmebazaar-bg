import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { registerSchema, loginSchema } from '@shared/validation/auth.schema';
import { authRateLimiter, registerRateLimiter } from '../middlewares/rateLimiter';
import { jwtMw } from '@shared/auth';
import { requireRole } from '@shared/middleware/auth';
import { UserRole } from '@shared/types/feature';

const router = Router();

// Public routes
router.post(
  '/register',
  registerRateLimiter,
  validateRequest(registerSchema),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  authController.login
);

router.post(
  '/refresh',
  authRateLimiter,
  authController.refreshToken
);

router.post(
  '/logout',
  authRateLimiter,
  authController.logout
);

// Protected routes
router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

router.get(
  '/profile',
  authController.getUserProfile
);

router.post(
  '/upgrade-pro',
  authController.upgradeToPro
);

// Admin routes
router.post(
  '/add-role',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  authController.addUserRole
);

router.post(
  '/remove-role',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  authController.removeUserRole
);

export default router;
