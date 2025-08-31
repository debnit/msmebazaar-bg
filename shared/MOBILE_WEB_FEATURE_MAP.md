# Mobile-Web Feature Consolidation Map

## Shared Components Structure

### UI Components (Platform Agnostic)
```
shared/components/ui/
├── Button/
├── Input/
├── Modal/
├── Loading/
├── ErrorBoundary/
└── Typography/
```

### Business Components 
```
shared/components/business/
├── UserProfile/
├── PaymentForm/
├── MSMEListing/
├── Search/
├── Filters/
└── Analytics/
```

### Layout Components
```
shared/components/layouts/
├── DashboardLayout/
├── AuthLayout/
├── ListingLayout/
└── ProfileLayout/
```

## Shared Hooks

### API Hooks
```
shared/hooks/api/
├── useAuth.ts
├── useListings.ts
├── usePayments.ts
├── useAnalytics.ts
└── useNotifications.ts
```

### Business Logic Hooks
```
shared/hooks/business/
├── useFeatureGating.ts
├── useRoleBasedAccess.ts
├── useSubscriptionStatus.ts
└── useUserPermissions.ts
```

## Shared Utils

### Common Utils (Mobile & Web)
```
shared/utils/common/
├── validation.ts
├── formatting.ts
├── dateUtils.ts
├── currency.ts
└── constants.ts
```

### Platform Specific Utils
```
shared/utils/mobile/
├── storage.ts
├── permissions.ts
└── navigation.ts

shared/utils/web/
├── localStorage.ts
├── routing.ts
└── seo.ts
```

## Resource Sharing Strategy

### 1. Shared State Management
- Move common stores to shared/stores/
- Platform-specific implementations in mobile/web

### 2. Shared API Layer
- Consolidate API calls in shared/api/
- Platform-agnostic request/response handling

### 3. Shared Business Logic
- Move validation schemas to shared/validation/
- Consolidate feature flags and permissions

### 4. Shared Assets
- Common icons, images in shared/assets/
- Platform-specific assets in respective directories

### 5. Shared Constants
- Colors, typography, spacing in shared/constants/
- Platform-specific overrides allowed
