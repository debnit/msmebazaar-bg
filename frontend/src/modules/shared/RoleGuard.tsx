"use client";
import { useAuthStore } from '@/store/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useFeatureAccess } from '@/hooks/use-Feature-Access';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { UpgradePrompt } from '@/components/route-fallbacks/upgrade-prompt';
import { RoleMismatchPrompt } from '@/components/route-fallbacks/role-mismatch-prompt';
import { AccessDeniedPrompt } from '@/components/route-fallbacks/access-denied-prompt';

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  proOnly?: boolean;
  requiredFeatures?: string[];
  fallback?: ReactNode;
  redirectOnFail?: boolean;
  showFallback?: boolean;
}

export default function EnhancedRoleGuard({ 
  allowedRoles, 
  children, 
  proOnly = false,
  requiredFeatures = [],
  fallback,
  redirectOnFail = true,
  showFallback = true
}: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { hasFeatureAccess, isLoading: featureLoading } = useFeatureAccess();
  const router = useRouter();
  const pathname = usePathname();
  const [validationComplete, setValidationComplete] = useState(false);

  useEffect(() => {
    if (isLoading || featureLoading) return;

    // Check authentication
    if (!isAuthenticated) {
      if (redirectOnFail) {
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
        router.replace(loginUrl);
      }
      setValidationComplete(true);
      return;
    }

    // Check user exists
    if (!user) {
      if (redirectOnFail) {
        router.replace('/login');
      }
      setValidationComplete(true);
      return;
    }

    // Check role access
    const userRoles = user.roles || [];
    const hasRoleAccess = allowedRoles.some(role => 
      userRoles.includes(role) || 
      userRoles.includes('admin') || 
      userRoles.includes('superadmin')
    );

    if (!hasRoleAccess) {
      if (redirectOnFail) {
        router.replace('/dashboard');
      }
      setValidationComplete(true);
      return;
    }

    // Check pro status
    if (proOnly && !user.isPro) {
      if (redirectOnFail) {
        router.replace('/onboarding');
      }
      setValidationComplete(true);
      return;
    }

    // Check feature access
    if (requiredFeatures.length > 0) {
      const hasAllFeatures = requiredFeatures.every(feature => hasFeatureAccess(feature));
      if (!hasAllFeatures) {
        if (redirectOnFail) {
          router.replace('/upgrade');
        }
        setValidationComplete(true);
        return;
      }
    }

    setValidationComplete(true);
  }, [
    isAuthenticated, 
    user, 
    allowedRoles, 
    proOnly, 
    requiredFeatures, 
    hasFeatureAccess, 
    redirectOnFail, 
    router, 
    pathname,
    isLoading,
    featureLoading
  ]);

  // Show loading state
  if (isLoading || featureLoading || !validationComplete) {
    return <LoadingSpinner />;
  }

  // Show fallback for unauthenticated users
  if (!isAuthenticated) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return <AccessDeniedPrompt reason="unauthenticated" />;
  }

  // Show fallback for missing user
  if (!user) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return <AccessDeniedPrompt reason="user_not_found" />;
  }

  // Show fallback for role mismatch
  const userRoles = user.roles || [];
  const hasRoleAccess = allowedRoles.some(role => 
    userRoles.includes(role) || 
    userRoles.includes('admin') || 
    userRoles.includes('superadmin')
  );

  if (!hasRoleAccess) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return <RoleMismatchPrompt currentRole={user.primaryRole} allowedRoles={allowedRoles} />;
  }

  // Show fallback for pro features
  if (proOnly && !user.isPro) {
    if (showFallback && fallback) {
      return <>{fallback}</>;
    }
    return <UpgradePrompt feature={getFeatureFromPath(pathname)} />;
  }

  // Show fallback for missing features
  if (requiredFeatures.length > 0) {
    const hasAllFeatures = requiredFeatures.every(feature => hasFeatureAccess(feature));
    if (!hasAllFeatures) {
      if (showFallback && fallback) {
        return <>{fallback}</>;
      }
      return <UpgradePrompt feature={requiredFeatures[0]} />;
    }
  }

  // All validations passed
  return <>{children}</>;
}

// Helper function to extract feature from path
function getFeatureFromPath(pathname: string): string {
  const featureMap: Record<string, string> = {
    '/buyer/pro': 'buyer_pro',
    '/seller/pro': 'seller_pro',
    '/agent/pro': 'agent_pro',
    '/investor/pro': 'investor_pro',
    '/msmeowner/pro': 'msmeowner_pro',
    '/business-valuation': 'business_valuation',
    '/exit-strategy': 'exit_strategy',
    '/market-linkage': 'market_linkage',
    '/leadership-training': 'leadership_training'
  };

  return featureMap[pathname] || 'premium_feature';
}
