"use client";

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/services/api-client';
import { useAuthStore } from '@/store/auth.store';

interface RouteData {
  [key: string]: any;
}

interface ProgressiveLoadingOptions {
  preloadRelated?: boolean;
  cacheData?: boolean;
  maxCacheSize?: number;
}

export function useProgressiveRouteLoading(
  pathname: string,
  options: ProgressiveLoadingOptions = {}
) {
  const { preloadRelated = true, cacheData = true, maxCacheSize = 10 } = options;
  const { user } = useAuthStore();
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Map<string, RouteData>>(new Map());

  // Preload route-specific data based on pathname
  const preloadRouteData = useCallback(async (path: string): Promise<RouteData> => {
    const data: RouteData = {};

    try {
      // Preload based on route type
      if (path.startsWith('/buyer')) {
        data.profile = await api.buyer.getProfile();
        data.listings = await api.buyer.browseListings();
      } else if (path.startsWith('/seller')) {
        data.profile = await api.seller.getProfile();
        data.listings = await api.seller.getListings();
      } else if (path.startsWith('/admin')) {
        data.dashboard = await api.admin.getDashboard();
        data.users = await api.admin.getUsers();
      } else if (path.startsWith('/dashboard')) {
        data.profile = await api.user.getProfile();
        data.analytics = await api.analytics.getDashboard({ role: user?.primaryRole });
      } else if (path.startsWith('/loans')) {
        data.applications = await api.loans.getApplications();
      }
    } catch (err) {
      console.warn('Failed to preload some route data:', err);
    }

    return data;
  }, [user?.primaryRole]);

  // Preload related API calls for better UX
  const preloadRelatedAPIs = useCallback(async (path: string) => {
    try {
      // Preload common data that might be needed
      const commonData = await Promise.allSettled([
        api.user.getProfile(),
        api.analytics.getDashboard({ role: user?.primaryRole })
      ]);

      // Preload role-specific data
      if (path.startsWith('/buyer')) {
        await Promise.allSettled([
          api.buyer.getAnalytics(),
          api.buyer.getSavedSearches()
        ]);
      } else if (path.startsWith('/seller')) {
        await Promise.allSettled([
          api.seller.getAnalytics(),
          api.seller.getInquiries()
        ]);
      }
    } catch (err) {
      console.warn('Failed to preload related APIs:', err);
    }
  }, [user?.primaryRole]);

  // Load route data with caching
  const loadRouteData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (cacheData && cache.has(pathname)) {
        setRouteData(cache.get(pathname)!);
        setLoading(false);
        return;
      }

      // Load fresh data
      const data = await preloadRouteData(pathname);
      setRouteData(data);

      // Cache the data
      if (cacheData) {
        setCache(prevCache => {
          const newCache = new Map(prevCache);
          newCache.set(pathname, data);
          
          // Limit cache size
          if (newCache.size > maxCacheSize) {
            const firstKey = newCache.keys().next().value;
            newCache.delete(firstKey);
          }
          
          return newCache;
        });
      }

      // Preload related APIs in background
      if (preloadRelated) {
        preloadRelatedAPIs(pathname);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load route data');
    } finally {
      setLoading(false);
    }
  }, [pathname, preloadRouteData, preloadRelatedAPIs, preloadRelated, cacheData, cache, maxCacheSize]);

  // Load data when pathname changes
  useEffect(() => {
    loadRouteData();
  }, [loadRouteData]);

  // Clear cache when user changes
  useEffect(() => {
    setCache(new Map());
  }, [user?.id]);

  return {
    routeData,
    loading,
    error,
    refetch: loadRouteData,
    clearCache: () => setCache(new Map())
  };
}

// Hook for preloading specific route data
export function useRoutePreloader() {
  const preloadRoute = useCallback(async (pathname: string) => {
    try {
      // Preload route data in background
      const data = await preloadRouteData(pathname);
      return data;
    } catch (err) {
      console.warn('Failed to preload route:', pathname, err);
      return null;
    }
  }, []);

  const preloadMultipleRoutes = useCallback(async (routes: string[]) => {
    const results = await Promise.allSettled(
      routes.map(route => preloadRoute(route))
    );
    
    return results.map((result, index) => ({
      route: routes[index],
      data: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }, [preloadRoute]);

  return {
    preloadRoute,
    preloadMultipleRoutes
  };
}

// Helper function to preload route data
async function preloadRouteData(pathname: string): Promise<RouteData> {
  const data: RouteData = {};

  try {
    if (pathname.startsWith('/buyer')) {
      data.profile = await api.buyer.getProfile();
      data.listings = await api.buyer.browseListings();
    } else if (pathname.startsWith('/seller')) {
      data.profile = await api.seller.getProfile();
      data.listings = await api.seller.getListings();
    } else if (pathname.startsWith('/admin')) {
      data.dashboard = await api.admin.getDashboard();
      data.users = await api.admin.getUsers();
    } else if (pathname.startsWith('/dashboard')) {
      data.profile = await api.user.getProfile();
    } else if (pathname.startsWith('/loans')) {
      data.applications = await api.loans.getApplications();
    }
  } catch (err) {
    console.warn('Failed to preload route data:', err);
  }

  return data;
}