#!/bin/bash
set -e

echo "=== Optimizing Shared Resources Across Monorepo ==="

cd "$(dirname "$0")/.."

echo "1. Consolidating API clients..."
mkdir -p shared/api/{auth,listings,payments,users,admin}

# Create base API client
cat > shared/api/base-client.ts << 'EOL'
// Base API client for both mobile and web
import { z } from 'zod';

export interface APIConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export class BaseAPIClient {
  protected config: APIConfig;
  
  constructor(config: APIConfig) {
    this.config = config;
  }
  
  // Platform-agnostic HTTP methods
  async get<T>(endpoint: string, schema?: z.ZodSchema<T>): Promise<T> {
    // Implementation varies by platform (fetch for web, axios for mobile)
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async post<T>(endpoint: string, data: any, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async put<T>(endpoint: string, data: any, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
  
  async delete<T>(endpoint: string, schema?: z.ZodSchema<T>): Promise<T> {
    throw new Error('Must be implemented by platform-specific client');
  }
}
EOL

echo "2. Creating shared state management..."
mkdir -p shared/stores/{auth,user,listings,payments}

cat > shared/stores/auth-store.ts << 'EOL'
// Shared auth store (works with both Zustand and Redux)
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  roles: z.array(z.string()),
  isPro: z.boolean(),
});

export type User = z.infer<typeof UserSchema>;

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

// Base implementation - platform-specific stores extend this
export const createAuthStore = (implementation: {
  storage: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
  apiClient: any;
}) => {
  // Store creation logic here
  return implementation;
};
EOL

echo "3. Consolidating constants and themes..."
mkdir -p shared/constants/{colors,typography,spacing,breakpoints}

cat > shared/constants/colors/index.ts << 'EOL'
// Shared color system for mobile and web
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    900: '#1e3a8a',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    500: '#64748b',
    600: '#475569',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    500: '#22c55e',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
};

// Platform-specific color exports
export const mobileColors = {
  ...colors,
  // React Native specific colors
  statusBar: colors.primary[600],
  tabBar: colors.secondary[50],
};

export const webColors = {
  ...colors,
  // Web specific colors
  focus: colors.primary[500],
  hover: colors.secondary[100],
};
EOL

cat > shared/constants/typography/index.ts << 'EOL'
// Shared typography system
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// Mobile typography (React Native compatible)
export const mobileTypography = {
  ...typography,
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
};
EOL

echo "4. Creating dependency optimization report..."
cat > SHARED_RESOURCES_REPORT.md << 'EOL'
# Shared Resources Optimization Report

## Current Status
- ✅ Shared validation schemas (Zod)
- ✅ Shared types (@msmebazaar/types)
- ✅ Shared utilities (@msmebazaar/shared)
- 🚧 Component consolidation (in progress)
- 🚧 API client consolidation (in progress)
- 🚧 State management unification (planned)

## Benefits of Consolidation

### 1. Reduced Bundle Size
- Eliminate duplicate business logic
- Share validation schemas
- Common utility functions

### 2. Consistency
- Unified design system
- Consistent API handling
- Shared error handling

### 3. Maintainability
- Single source of truth for business logic
- Easier testing across platforms
- Simplified updates and bug fixes

## Implementation Strategy

### Phase 1: Foundation (Current)
- ✅ Shared types and validation
- ✅ Basic utilities
- 🚧 Component structure

### Phase 2: API & State
- 🚧 Unified API clients
- 🚧 Shared state management
- 🚧 Common hooks

### Phase 3: UI & UX
- 📋 Design system implementation
- 📋 Component library completion
- 📋 Platform-specific optimizations

### Phase 4: Optimization
- 📋 Bundle analysis
- 📋 Performance optimization
- 📋 Code splitting strategies

## Next Steps
1. Run migrate-mobile-web-components.sh
2. Implement actual component logic
3. Set up shared state management
4. Create unified API layer
5. Implement design system
EOL

echo "Shared resource optimization structure created!"
echo "Run ./scripts/migrate-mobile-web-components.sh to start component migration"
