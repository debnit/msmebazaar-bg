"use client";

import React from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { RouteErrorFallback } from "@/components/route-fallbacks/route-error-fallback";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  route?: string;
}

export function RouteErrorBoundary({ 
  children, 
  fallback,
  onError,
  route
}: RouteErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with route context
    console.error(`Route Error [${route || 'unknown'}]:`, error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
    
    // TODO: Send to logging service with route context
    // logError(error, { route, ...errorInfo });
  };

  return (
    <ErrorBoundary
      fallback={fallback || RouteErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}

// Higher-order component for wrapping pages with error boundaries
export function withRouteErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  route?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <RouteErrorBoundary route={route}>
        <Component {...props} />
      </RouteErrorBoundary>
    );
  };
}