"use client";

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useFeatureAccess } from '@/hooks/use-Feature-Access';
import { 
  isPublicRoute, 
  isRoleRoute, 
  isFeatureRoute, 
  isAdminRoute,
  hasRouteAccess 
} from '@/utils/route-validation';

export interface RouteValidationResult {
  isValid: boolean;
  reason: 'valid' | 'unauthenticated' | 'insufficient_permissions' | 'feature_not_available' | 'pro_required' | 'role_mismatch';
  redirectTo?: string;
  message?: string;
}

export function useRouteValidation(pathname: string): RouteValidationResult {
  const { user, isAuthenticated } = useAuthStore();
  const { hasFeatureAccess } = useFeatureAccess();
  
  return useMemo(() => {
    // Public routes are always valid
    if (isPublicRoute(pathname)) {
      return { isValid: true, reason: 'valid' };
    }
    
    // Check authentication
    if (!isAuthenticated || !user) {
      return { 
        isValid: false, 
        reason: 'unauthenticated',
        redirectTo: `/login?redirect=${encodeURIComponent(pathname)}`,
        message: 'Please sign in to access this feature'
      };
    }
    
    // Check role-based access
    if (isRoleRoute(pathname)) {
      const hasAccess = hasRouteAccess(user, pathname);
      if (!hasAccess) {
        return { 
          isValid: false, 
          reason: 'role_mismatch',
          redirectTo: '/dashboard',
          message: 'You don\'t have permission to access this area'
        };
      }
    }
    
    // Check admin access
    if (isAdminRoute(pathname)) {
      if (pathname.startsWith('/superadmin')) {
        if (!user.roles?.includes('superadmin')) {
          return { 
            isValid: false, 
            reason: 'insufficient_permissions',
            redirectTo: '/dashboard',
            message: 'Super admin access required'
          };
        }
      } else if (!user.roles?.includes('admin') && !user.roles?.includes('superadmin')) {
        return { 
          isValid: false, 
          reason: 'insufficient_permissions',
          redirectTo: '/dashboard',
          message: 'Admin access required'
        };
      }
    }
    
    // Check feature access
    if (isFeatureRoute(pathname)) {
      const feature = getFeatureFromPath(pathname);
      if (feature && !hasFeatureAccess(feature)) {
        return { 
          isValid: false, 
          reason: 'feature_not_available',
          redirectTo: '/upgrade',
          message: 'This feature requires a Pro subscription'
        };
      }
    }
    
    // Check pro status for pro-only features
    if (isProFeature(pathname) && !user.isPro) {
      return { 
        isValid: false, 
        reason: 'pro_required',
        redirectTo: '/onboarding',
        message: 'Pro subscription required for this feature'
      };
    }
    
    return { isValid: true, reason: 'valid' };
  }, [pathname, user, isAuthenticated, hasFeatureAccess]);
}

// Helper function to extract feature from path
function getFeatureFromPath(pathname: string): string | null {
  const featureMap: Record<string, string> = {
    '/business-loans': 'business_loans',
    '/business-valuation': 'business_valuation',
    '/exit-strategy': 'exit_strategy',
    '/market-linkage': 'market_linkage',
    '/networking': 'networking',
    '/leadership-training': 'leadership_training'
  };

  for (const [path, feature] of Object.entries(featureMap)) {
    if (pathname.startsWith(path)) {
      return feature;
    }
  }

  return null;
}

// Helper function to check if path is a pro feature
function isProFeature(pathname: string): boolean {
  const proFeatures = [
    '/buyer/pro',
    '/seller/pro',
    '/agent/pro',
    '/investor/pro',
    '/msmeowner/pro',
    '/business-valuation',
    '/exit-strategy',
    '/market-linkage',
    '/leadership-training'
  ];

  return proFeatures.some(feature => pathname.startsWith(feature));
}