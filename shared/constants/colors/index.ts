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
