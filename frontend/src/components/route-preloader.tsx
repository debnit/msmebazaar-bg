"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRoutePreloader } from '@/hooks/useProgressiveRouteLoading';

interface RoutePreloaderProps {
  routes?: string[];
  children: React.ReactNode;
}

export function RoutePreloader({ routes = [], children }: RoutePreloaderProps) {
  const pathname = usePathname();
  const { preloadRoute, preloadMultipleRoutes } = useRoutePreloader();

  useEffect(() => {
    // Preload current route
    preloadRoute(pathname);

    // Preload specified routes
    if (routes.length > 0) {
      preloadMultipleRoutes(routes);
    }
  }, [pathname, routes, preloadRoute, preloadMultipleRoutes]);

  return <>{children}</>;
}

// Higher-order component for automatic route preloading
export function withRoutePreloader<P extends object>(
  Component: React.ComponentType<P>,
  preloadRoutes: string[] = []
) {
  return function WrappedComponent(props: P) {
    return (
      <RoutePreloader routes={preloadRoutes}>
        <Component {...props} />
      </RoutePreloader>
    );
  };
}
