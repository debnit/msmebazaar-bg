"use client";

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { RouteErrorBoundary } from '@/components/route-error-boundary';
import { RoutePreloader } from '@/components/route-preloader';
import { PageTransition } from '@/components/navigation/smooth-transition';
import { useRouteValidation } from '@/hooks/useRouteValidation';
import { LoadingFallback } from '@/components/route-fallbacks/loading-fallback';
import { AccessDeniedPrompt } from '@/components/route-fallbacks/access-denied-prompt';
import { NotFoundFallback } from '@/components/route-fallbacks/not-found-fallback';

interface RouteWrapperProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  proOnly?: boolean;
  requiredFeatures?: string[];
  preloadRoutes?: string[];
  showFallback?: boolean;
}

export function RouteWrapper({
  children,
  requireAuth = false,
  allowedRoles = [],
  proOnly = false,
  requiredFeatures = [],
  preloadRoutes = [],
  showFallback = true
}: RouteWrapperProps) {
  const pathname = usePathname();
  const validation = useRouteValidation(pathname);

  // Show loading state during validation
  if (validation.reason === 'valid' && validation.isValid) {
    return (
      <RouteErrorBoundary route={pathname}>
        <RoutePreloader routes={preloadRoutes}>
          <PageTransition>
            {children}
          </PageTransition>
        </RoutePreloader>
      </RouteErrorBoundary>
    );
  }

  // Show access denied for invalid routes
  if (!validation.isValid && showFallback) {
    if (validation.reason === 'unauthenticated') {
      return <AccessDeniedPrompt reason="unauthenticated" />;
    }
    
    if (validation.reason === 'insufficient_permissions') {
      return <AccessDeniedPrompt reason="insufficient_permissions" />;
    }
    
    if (validation.reason === 'role_mismatch') {
      return <NotFoundFallback title="Access Restricted" description="You don't have permission to access this page." />;
    }
    
    return <NotFoundFallback />;
  }

  // Show loading fallback
  return <LoadingFallback type="page" message="Validating access..." />;
}

// Higher-order component for wrapping pages with route protection
export function withRouteProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteWrapperProps, 'children'> = {}
) {
  return function ProtectedComponent(props: P) {
    return (
      <RouteWrapper {...options}>
        <Component {...props} />
      </RouteWrapper>
    );
  };
}

// Specialized wrappers for different route types
export function AuthRoute({ children }: { children: ReactNode }) {
  return (
    <RouteWrapper requireAuth={true}>
      {children}
    </RouteWrapper>
  );
}

export function RoleRoute({ 
  children, 
  allowedRoles 
}: { 
  children: ReactNode; 
  allowedRoles: string[];
}) {
  return (
    <RouteWrapper requireAuth={true} allowedRoles={allowedRoles}>
      {children}
    </RouteWrapper>
  );
}

export function ProRoute({ 
  children, 
  requiredFeatures = [] 
}: { 
  children: ReactNode; 
  requiredFeatures?: string[];
}) {
  return (
    <RouteWrapper requireAuth={true} proOnly={true} requiredFeatures={requiredFeatures}>
      {children}
    </RouteWrapper>
  );
}