// hooks/useRouteValidation.ts
export function useRouteValidation(pathname: string) {
    const { user } = useAuthStore();
    const { hasFeatureAccess } = useFeatureAccess();
    
    const validation = useMemo(() => {
      if (isPublicRoute(pathname)) return { isValid: true, reason: null };
      
      if (!user) return { isValid: false, reason: 'unauthenticated' };
      
      if (isRoleRoute(pathname)) {
        const role = pathname.split('/')[1];
        if (!user.roles.includes(role)) {
          return { isValid: false, reason: 'insufficient_permissions' };
        }
      }
      
      if (isFeatureRoute(pathname)) {
        const feature = getFeatureFromPath(pathname);
        if (!hasFeatureAccess(feature)) {
          return { isValid: false, reason: 'feature_not_available' };
        }
      }
      
      return { isValid: true, reason: null };
    }, [pathname, user, hasFeatureAccess]);
    
    return validation;
  }