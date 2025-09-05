"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

interface NavigationState {
  isLoading: boolean;
  currentPath: string;
  previousPath: string | null;
  breadcrumbs: Array<{ label: string; href: string }>;
  canGoBack: boolean;
  navigationHistory: string[];
}

interface NavigationActions {
  navigate: (path: string, options?: { replace?: boolean; scroll?: boolean }) => void;
  goBack: () => void;
  setLoading: (loading: boolean) => void;
  clearHistory: () => void;
}

interface NavigationContextType extends NavigationState, NavigationActions {}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  maxHistorySize?: number;
}

export function NavigationProvider({ 
  children, 
  maxHistorySize = 10 
}: NavigationProviderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [previousPath, setPreviousPath] = useState<string | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Update navigation state when pathname changes
  useEffect(() => {
    if (pathname !== previousPath) {
      setPreviousPath(pathname);
      setNavigationHistory(prev => {
        const newHistory = [...prev];
        if (newHistory[newHistory.length - 1] !== pathname) {
          newHistory.push(pathname);
          if (newHistory.length > maxHistorySize) {
            newHistory.shift();
          }
        }
        return newHistory;
      });
    }
  }, [pathname, previousPath, maxHistorySize]);

  // Generate breadcrumbs from current path
  const breadcrumbs = React.useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', href: '/' }];
    
    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      crumbs.push({
        label,
        href: currentPath
      });
    });
    
    return crumbs;
  }, [pathname]);

  const canGoBack = navigationHistory.length > 1;

  const navigate = (path: string, options: { replace?: boolean; scroll?: boolean } = {}) => {
    setIsLoading(true);
    
    if (options.replace) {
      router.replace(path);
    } else {
      router.push(path);
    }
    
    // Reset loading state after navigation
    setTimeout(() => setIsLoading(false), 300);
  };

  const goBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const clearHistory = () => {
    setNavigationHistory([]);
  };

  const value: NavigationContextType = {
    // State
    isLoading,
    currentPath: pathname,
    previousPath,
    breadcrumbs,
    canGoBack,
    navigationHistory,
    
    // Actions
    navigate,
    goBack,
    setLoading,
    clearHistory,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

// Hook for navigation with loading state
export function useNavigate() {
  const { navigate, setLoading } = useNavigation();
  
  return (path: string, options?: { replace?: boolean; scroll?: boolean }) => {
    setLoading(true);
    navigate(path, options);
  };
}

// Hook for breadcrumb navigation
export function useBreadcrumbs() {
  const { breadcrumbs } = useNavigation();
  return breadcrumbs;
}
