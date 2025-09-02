// components/route-error-boundary.tsx
export function RouteErrorBoundary({ 
    children, 
    fallback,
    onError 
  }: RouteErrorBoundaryProps) {
    return (
      <ErrorBoundary
        fallback={fallback || <RouteErrorFallback />}
        onError={onError}
      >
        {children}
      </ErrorBoundary>
    );
  }
  
  // Usage in pages
  <RouteErrorBoundary fallback={<CustomErrorPage />}>
    <BuyerDashboard />
  </RouteErrorBoundary>