import { User } from '@/types/user';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/pricing',
  '/features'
];

// Role-based route mappings
const ROLE_ROUTES = {
  buyer: ['/buyer'],
  seller: ['/seller'],
  agent: ['/agent'],
  investor: ['/investor'],
  admin: ['/admin'],
  superadmin: ['/superadmin'],
  msme_owner: ['/msmeowner']
};

// Feature routes that require specific permissions
const FEATURE_ROUTES = {
  'business-loans': ['buyer', 'seller', 'msme_owner'],
  'business-valuation': ['buyer', 'seller', 'msme_owner'],
  'exit-strategy': ['seller', 'msme_owner'],
  'market-linkage': ['buyer', 'seller', 'msme_owner'],
  'networking': ['buyer', 'seller', 'agent', 'investor', 'msme_owner']
};

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

export function isRoleRoute(pathname: string): boolean {
  return Object.values(ROLE_ROUTES).some(routes => 
    routes.some(route => pathname.startsWith(route))
  );
}

export function isFeatureRoute(pathname: string): boolean {
  return Object.keys(FEATURE_ROUTES).some(feature => pathname.startsWith(`/${feature}`));
}

export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith('/admin') || pathname.startsWith('/superadmin');
}

export function hasRouteAccess(user: User, pathname: string): boolean {
  if (!user?.roles?.length) return false;

  // Admin and superadmin have access to everything
  if (user.roles.includes('admin') || user.roles.includes('superadmin')) {
    return true;
  }

  // Check role-based access
  if (isRoleRoute(pathname)) {
    const requiredRole = getRequiredRole(pathname);
    if (requiredRole) {
      return user.roles.includes(requiredRole);
    }
  }

  // Check feature access
  if (isFeatureRoute(pathname)) {
    const feature = getFeatureFromPath(pathname);
    if (feature) {
      const allowedRoles = FEATURE_ROUTES[feature as keyof typeof FEATURE_ROUTES];
      return allowedRoles.some(role => user.roles.includes(role));
    }
  }

  return false;
}

export function getRequiredRole(pathname: string): string | null {
  for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
    if (routes.some(route => pathname.startsWith(route))) {
      return role;
    }
  }
  return null;
}

export function getFeatureFromPath(pathname: string): string | null {
  for (const feature of Object.keys(FEATURE_ROUTES)) {
    if (pathname.startsWith(`/${feature}`)) {
      return feature;
    }
  }
  return null;
}

export function getAllowedRolesForFeature(feature: string): string[] {
  return FEATURE_ROUTES[feature as keyof typeof FEATURE_ROUTES] || [];
}

export function getUserAccessibleRoutes(user: User): string[] {
  if (!user?.roles?.length) return [];

  const accessibleRoutes: string[] = [];

  // Add role-specific routes
  user.roles.forEach(role => {
    const roleRoutes = ROLE_ROUTES[role as keyof typeof ROLE_ROUTES];
    if (roleRoutes) {
      accessibleRoutes.push(...roleRoutes);
    }
  });

  // Add feature routes based on user roles
  Object.entries(FEATURE_ROUTES).forEach(([feature, allowedRoles]) => {
    if (allowedRoles.some(role => user.roles.includes(role))) {
      accessibleRoutes.push(`/${feature}`);
    }
  });

  // Admin and superadmin get additional routes
  if (user.roles.includes('admin')) {
    accessibleRoutes.push('/admin');
  }
  if (user.roles.includes('superadmin')) {
    accessibleRoutes.push('/superadmin');
  }

  return accessibleRoutes;
}

export function validateRouteAccess(user: User, pathname: string): {
  hasAccess: boolean;
  reason?: string;
  redirectTo?: string;
} {
  // Public routes are always accessible
  if (isPublicRoute(pathname)) {
    return { hasAccess: true };
  }

  // Check if user is authenticated
  if (!user) {
    return { 
      hasAccess: false, 
      reason: 'unauthenticated',
      redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`
    };
  }

  // Check role-based access
  if (isRoleRoute(pathname)) {
    const hasAccess = hasRouteAccess(user, pathname);
    if (!hasAccess) {
      return { 
        hasAccess: false, 
        reason: 'insufficient_permissions',
        redirectTo: '/dashboard'
      };
    }
  }

  // Check admin access
  if (isAdminRoute(pathname)) {
    if (pathname.startsWith('/superadmin')) {
      if (!user.roles.includes('superadmin')) {
        return { 
          hasAccess: false, 
          reason: 'insufficient_permissions',
          redirectTo: '/dashboard'
        };
      }
    } else if (!user.roles.includes('admin') && !user.roles.includes('superadmin')) {
      return { 
        hasAccess: false, 
        reason: 'insufficient_permissions',
        redirectTo: '/dashboard'
      };
    }
  }

  // Check feature access
  if (isFeatureRoute(pathname)) {
    const feature = getFeatureFromPath(pathname);
    if (feature) {
      const allowedRoles = FEATURE_ROUTES[feature as keyof typeof FEATURE_ROUTES];
      const hasAccess = allowedRoles.some(role => user.roles.includes(role));
      if (!hasAccess) {
        return { 
          hasAccess: false, 
          reason: 'feature_not_available',
          redirectTo: '/upgrade'
        };
      }
    }
  }

  return { hasAccess: true };
}
