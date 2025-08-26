/**
 * Centralized route constants and helper functions for MSMEBazaar navigation
 * Combines role, feature, admin, and public routes in one place.
 */

export type RouteDef = { path: string; label: string; description?: string; icon?: string };

// -----------------------------
// Public routes (accessible without login)
// -----------------------------
export const PUBLIC_ROUTES: Record<string, RouteDef> = {
  home: { path: "/", label: "Home", description: "MSMEBazaar Homepage" },
  login: { path: "/login", label: "Login", description: "User Login" },
  register: { path: "/register", label: "Register", description: "User Registration" },
  forgotPassword: { path: "/forgot-password", label: "Forgot Password", description: "Password Recovery" },
  resetPassword: { path: "/reset-password", label: "Reset Password", description: "Password Reset" },
  verifyEmail: { path: "/verify-email", label: "Verify Email", description: "Email Verification" },
  about: { path: "/about", label: "About Us", description: "About MSMEBazaar" },
  contact: { path: "/contact", label: "Contact", description: "Contact Us" },
  privacy: { path: "/privacy", label: "Privacy Policy", description: "Privacy Policy" },
  terms: { path: "/terms", label: "Terms", description: "Terms of Service" },
  pricing: { path: "/pricing", label: "Pricing", description: "Pricing Plans" },
  features: { path: "/features", label: "Features", description: "Platform Features" },
};

// -----------------------------
// Role-specific dashboard routes
// -----------------------------
export const ROLE_ROUTES: Record<string, RouteDef[]> = {
  buyer: [
    { path: "/buyer/free", label: "Buyer Dashboard", description: "Browse MSME listings and connect with sellers", icon: "👤" },
    { path: "/buyer/pro", label: "Buyer Pro Dashboard", description: "Advanced search, saved searches, and analytics", icon: "👤⭐" },
    { path: "/buyer/recommendations", label: "Recommendations", description: "Personalized MSME recommendations", icon: "🎯" },
  ],
  seller: [
    { path: "/seller/free", label: "Seller Dashboard", description: "Manage your MSME listings and inquiries", icon: "🏢" },
    { path: "/seller/pro", label: "Seller Pro Dashboard", description: "Unlimited listings, featured boost, advanced analytics", icon: "🏢⭐" },
    { path: "/seller/products", label: "My Products", description: "Manage your product listings", icon: "📦" },
    { path: "/seller/orders", label: "Orders", description: "View and manage orders", icon: "📋" },
  ],
  agent: [
    { path: "/agent/free", label: "Agent Dashboard", description: "Manage deals and track commissions", icon: "🤝" },
    { path: "/agent/pro", label: "Agent Pro Dashboard", description: "CRM dashboard, unlimited deals, higher commissions", icon: "🤝⭐" },
  ],
  investor: [
    { path: "/investor/free", label: "Investor Dashboard", description: "Browse investment opportunities", icon: "📈" },
    { path: "/investor/pro", label: "Investor Pro Dashboard", description: "Early access, direct chats, portfolio management", icon: "📈⭐" },
  ],
  msme_owner: [
    { path: "/msmeowner/free", label: "MSME Owner Dashboard", description: "Manage your MSME profile and services", icon: "🏭" },
    { path: "/msmeowner/pro", label: "MSME Owner Pro Dashboard", description: "Advanced MSME management tools", icon: "🏭⭐" },
  ],
  admin: [
    { path: "/admin", label: "Admin Dashboard", description: "System administration and user management", icon: "🛡️" },
  ],
  superadmin: [
    { path: "/superadmin", label: "Super Admin Dashboard", description: "System-wide administration and monitoring", icon: "👑" },
  ],
};

// -----------------------------
// Feature module routes
// -----------------------------
export const FEATURE_ROUTES: Record<string, RouteDef> = {
  businessLoans: { path: "/business-loans", label: "Business Loans", description: "Apply for business loans", icon: "💰" },
  loanApplication: { path: "/business-loans/apply", label: "Apply for Loan", description: "Loan application form", icon: "📝" },
  loanStatus: { path: "/business-loans/status", label: "Loan Status", description: "Check loan application status", icon: "📊" },
  businessValuation: { path: "/business-valuation", label: "Business Valuation", description: "Get your business valued", icon: "📊" },
  exitStrategy: { path: "/exit-strategy", label: "Exit Strategy", description: "Plan your business exit", icon: "🚪" },
  marketLinkage: { path: "/market-linkage", label: "Market Linkage", description: "Connect with business partners", icon: "🔗" },
  compliance: { path: "/compliance", label: "Compliance", description: "Regulatory compliance services", icon: "✅" },
  leadershipTraining: { path: "/leadership-training", label: "Leadership Training", description: "Business leadership programs", icon: "🎓" },
  networking: { path: "/networking", label: "Networking", description: "Business networking events", icon: "🤝" },
};

// -----------------------------
// Admin & Superadmin routes
// -----------------------------
export const ADMIN_ROUTES: Record<string, RouteDef> = {
  dashboard: { path: "/admin", label: "Admin Dashboard", description: "System overview and management", icon: "📊" },
  users: { path: "/admin/users", label: "User Management", description: "Manage platform users", icon: "👥" },
  features: { path: "/admin/features", label: "Feature Flags", description: "Manage feature flags", icon: "🚩" },
  analytics: { path: "/admin/analytics", label: "Analytics", description: "Platform analytics", icon: "📈" },
  systemHealth: { path: "/admin/system-health", label: "System Health", description: "Monitor system health", icon: "🏥" },
};

export const SUPERADMIN_ROUTES: Record<string, RouteDef> = {
  dashboard: { path: "/superadmin", label: "Super Admin Dashboard", description: "System-wide overview", icon: "👑" },
  systemHealth: { path: "/superadmin/system-health", label: "System Health", description: "Infrastructure monitoring", icon: "🏥" },
  analytics: { path: "/superadmin/analytics", label: "Analytics", description: "System-wide analytics", icon: "📈" },
  auditLogs: { path: "/superadmin/audit-logs", label: "Audit Logs", description: "System audit logs", icon: "📋" },
  configuration: { path: "/superadmin/configuration", label: "Configuration", description: "System configuration", icon: "⚙️" },
};

// -----------------------------
// Quick Access Routes (for navigation)
// -----------------------------
export const QUICK_ACCESS_ROUTES = {
  // Role-based quick access
  buyer: { path: "/buyer/free", label: "Buyer Platform", icon: "👤" },
  seller: { path: "/seller/free", label: "Seller Platform", icon: "🏢" },
  agent: { path: "/agent/free", label: "Agent Platform", icon: "🤝" },
  investor: { path: "/investor/free", label: "Investor Platform", icon: "📈" },
  admin: { path: "/admin", label: "Admin Panel", icon: "🛡️" },
  superadmin: { path: "/superadmin", label: "Super Admin", icon: "👑" },
  
  // Feature quick access
  loans: { path: "/business-loans", label: "Business Loans", icon: "💰" },
  valuation: { path: "/business-valuation", label: "Valuation", icon: "📊" },
  marketLinkage: { path: "/market-linkage", label: "Market Linkage", icon: "🔗" },
  networking: { path: "/networking", label: "Networking", icon: "🤝" },
};

// -----------------------------
// Navigation Groups
// -----------------------------
export const NAVIGATION_GROUPS = {
  platforms: {
    label: "Platforms",
    routes: [
      { path: "/buyer/free", label: "Buyer Platform", icon: "👤" },
      { path: "/seller/free", label: "Seller Platform", icon: "🏢" },
      { path: "/agent/free", label: "Agent Platform", icon: "🤝" },
      { path: "/investor/free", label: "Investor Platform", icon: "📈" },
    ]
  },
  services: {
    label: "Services",
    routes: [
      { path: "/business-loans", label: "Business Loans", icon: "💰" },
      { path: "/business-valuation", label: "Business Valuation", icon: "📊" },
      { path: "/market-linkage", label: "Market Linkage", icon: "🔗" },
      { path: "/networking", label: "Networking", icon: "🤝" },
    ]
  },
  admin: {
    label: "Administration",
    routes: [
      { path: "/admin", label: "Admin Dashboard", icon: "🛡️" },
      { path: "/superadmin", label: "Super Admin", icon: "👑" },
    ]
  }
};

// -----------------------------
// Helper functions
// -----------------------------
export interface RouteParams {
  id?: string;
  slug?: string;
  userId?: string;
  applicationId?: string;
  reportId?: string;
  orderId?: string;
  productId?: string;
  dealId?: string;
  ticketId?: string;
}

/** Build a route string with dynamic parameters */
export function buildRoute(route: string, params?: RouteParams): string {
  let r = route;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) {
        r = r.replace(`[${k}]`, String(v)).replace(`:${k}`, String(v));
      }
    });
  }
  return r;
}

export function isPublicRoute(path: string) {
  return Object.values(PUBLIC_ROUTES).some(r => r.path === path);
}

export function isRoleRoute(path: string) {
  return Object.values(ROLE_ROUTES).flat().some(r => path.startsWith(r.path.split("/")[1] || ""));
}

export function isAdminRoute(path: string) {
  return path.startsWith("/admin") || path.startsWith("/superadmin");
}

export function isFeatureRoute(path: string) {
  return Object.values(FEATURE_ROUTES).some(r => path.startsWith(r.path));
}

/** Get breadcrumbs from the current path */
export function getBreadcrumbs(path: string) {
  const parts = path.split("/").filter(Boolean);
  let acc = "";
  return parts.map(seg => {
    acc += `/${seg}`;
    return {
      label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " "),
      href: acc,
    };
  });
}

/** Get redirect route after login based on user state */
export function getPostLoginRedirect(user: any): string {
  if (!user.onboardingCompleted) return "/onboarding";
  if (!user.isPro) return "/onboarding-welcome";
  if (user.roles?.length > 1) return "/roles";
  const role = user.primaryRole || user.roles?.[0];
  return ROLE_ROUTES[role]?.[0]?.path || "/dashboard";
}

/** Get role-specific routes for a user */
export function getRoleRoutes(user: any): RouteDef[] {
  if (!user?.roles?.length) return [];
  const role = user.primaryRole || user.roles[0];
  return ROLE_ROUTES[role] || [];
}

/** Get all accessible routes for a user */
export function getUserRoutes(user: any): RouteDef[] {
  const routes: RouteDef[] = [];
  
  // Add role-specific routes
  if (user?.roles?.length) {
    user.roles.forEach((role: string) => {
      const roleRoutes = ROLE_ROUTES[role] || [];
      routes.push(...roleRoutes);
    });
  }
  
  // Add admin routes if user has admin role
  if (user?.roles?.includes('admin')) {
    routes.push(...Object.values(ADMIN_ROUTES));
  }
  
  // Add superadmin routes if user has superadmin role
  if (user?.roles?.includes('superadmin')) {
    routes.push(...Object.values(SUPERADMIN_ROUTES));
  }
  
  return routes;
}

/** Check if user has access to a specific route */
export function hasRouteAccess(user: any, path: string): boolean {
  // Public routes are always accessible
  if (isPublicRoute(path)) return true;
  
  // Check role-based access
  if (isRoleRoute(path)) {
    const role = path.split("/")[1];
    return user?.roles?.includes(role) || user?.roles?.includes('admin') || user?.roles?.includes('superadmin');
  }
  
  // Check admin access
  if (isAdminRoute(path)) {
    if (path.startsWith("/superadmin")) {
      return user?.roles?.includes('superadmin');
    }
    return user?.roles?.includes('admin') || user?.roles?.includes('superadmin');
  }
  
  // Feature routes are accessible to all authenticated users
  if (isFeatureRoute(path)) {
    return !!user;
  }
  
  return false;
}
