# Frontend Navigation Guide

This guide explains the enhanced navigation system implemented for MSMEBazaar frontend.

## Overview

The navigation system has been completely overhauled to provide:
- Smooth transitions between routes
- Progressive loading for better performance
- Comprehensive route protection and validation
- Enhanced error handling and fallbacks
- Centralized navigation state management

## Key Components

### 1. Route Protection

#### Enhanced RoleGuard
```tsx
import { RoleRoute } from "@/components/route-wrapper";

<RoleRoute allowedRoles={["buyer", "seller"]}>
  <YourComponent />
</RoleRoute>
```

#### Pro Feature Protection
```tsx
import { ProRoute } from "@/components/route-wrapper";

<ProRoute requiredFeatures={["business_valuation"]}>
  <ValuationComponent />
</ProRoute>
```

### 2. Route Validation

#### useRouteValidation Hook
```tsx
import { useRouteValidation } from "@/hooks/useRouteValidation";

const validation = useRouteValidation(pathname);
if (!validation.isValid) {
  // Handle invalid route
}
```

### 3. Progressive Loading

#### useProgressiveRouteLoading Hook
```tsx
import { useProgressiveRouteLoading } from "@/hooks/useProgressiveRouteLoading";

const { routeData, loading, error } = useProgressiveRouteLoading(pathname);
```

### 4. Smooth Transitions

#### Page Transitions
```tsx
import { PageTransition } from "@/components/navigation/smooth-transition";

<PageTransition>
  <YourPage />
</PageTransition>
```

#### Card Transitions
```tsx
import { CardTransition } from "@/components/navigation/smooth-transition";

<CardTransition>
  <YourCard />
</CardTransition>
```

### 5. Navigation Context

#### useNavigation Hook
```tsx
import { useNavigation } from "@/contexts/navigation-context";

const { navigate, goBack, breadcrumbs, isLoading } = useNavigation();
```

### 6. Error Boundaries

#### Route Error Boundary
```tsx
import { RouteErrorBoundary } from "@/components/route-error-boundary";

<RouteErrorBoundary route={pathname}>
  <YourComponent />
</RouteErrorBoundary>
```

## Route Structure

### Public Routes
- `/` - Homepage
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password recovery
- `/reset-password` - Password reset

### Role-Based Routes
- `/buyer/*` - Buyer platform
- `/seller/*` - Seller platform
- `/agent/*` - Agent platform
- `/investor/*` - Investor platform
- `/admin/*` - Admin panel
- `/superadmin/*` - Super admin panel

### Feature Routes
- `/business-loans` - Loan services
- `/business-valuation` - Valuation services
- `/market-linkage` - Market linkage
- `/networking` - Networking features

## Middleware Protection

The `middleware.ts` file provides server-side route protection:
- Authentication validation
- Role-based access control
- Feature access validation
- Pro status verification

## API Standardization

### useApiClient Hook
```tsx
import { useApiClient } from "@/hooks/useApiClient";

const { auth, user, loans, payments } = useApiClient();

// Standardized API calls with error handling
const result = await loans.apply(formData, {
  showSuccessToast: true,
  successMessage: 'Loan applied successfully!'
});
```

## Fallback Components

### Access Denied
```tsx
import { AccessDeniedPrompt } from "@/components/route-fallbacks";

<AccessDeniedPrompt reason="unauthenticated" />
```

### Upgrade Prompt
```tsx
import { UpgradePrompt } from "@/components/route-fallbacks";

<UpgradePrompt feature="business_valuation" />
```

### Loading Fallback
```tsx
import { LoadingFallback } from "@/components/route-fallbacks";

<LoadingFallback type="page" message="Loading dashboard..." />
```

## Best Practices

### 1. Route Protection
Always wrap protected routes with appropriate guards:
```tsx
<RoleRoute allowedRoles={["buyer"]}>
  <BuyerDashboard />
</RoleRoute>
```

### 2. Error Handling
Use error boundaries for route-level error handling:
```tsx
<RouteErrorBoundary route={pathname}>
  <YourPage />
</RouteErrorBoundary>
```

### 3. Loading States
Implement progressive loading for better UX:
```tsx
const { routeData, loading } = useProgressiveRouteLoading(pathname);

if (loading) return <LoadingFallback />;
```

### 4. API Calls
Use the standardized API client:
```tsx
const { loans } = useApiClient();
const result = await loans.apply(data);
```

### 5. Navigation
Use the navigation context for programmatic navigation:
```tsx
const { navigate } = useNavigation();
navigate('/dashboard');
```

## Performance Optimizations

1. **Route Preloading**: Routes are preloaded in the background
2. **Progressive Loading**: Data is loaded progressively for better UX
3. **Caching**: Route data is cached to reduce API calls
4. **Smooth Transitions**: Framer Motion provides smooth page transitions
5. **Loading States**: Comprehensive loading states prevent layout shifts

## Error Handling

1. **Route Validation**: Server-side and client-side route validation
2. **Error Boundaries**: Catch and handle JavaScript errors
3. **Fallback Components**: User-friendly error messages
4. **Retry Mechanisms**: Automatic retry for failed requests
5. **Logging**: Comprehensive error logging for debugging

## Security

1. **JWT Validation**: Server-side token validation
2. **Role-Based Access**: Granular permission system
3. **Feature Flags**: Dynamic feature access control
4. **Route Protection**: Multiple layers of route protection
5. **Session Management**: Automatic session handling

This navigation system provides a robust, secure, and user-friendly experience for the MSMEBazaar platform.
