/**
 * Centralized route constants and helper functions for MSMEBazaar navigation
 * Combines role, feature, admin, and public routes in one place.
 */

export type RouteDef = { path: string; label: string };

// -----------------------------
// Public routes (accessible without login)
// -----------------------------
export const PUBLIC_ROUTES: Record<string, RouteDef> = {
  home: { path: "/", label: "Home" },
  login: { path: "/login", label: "Login" },
  register: { path: "/register", label: "Register" },
  forgotPassword: { path: "/forgot-password", label: "Forgot Password" },
  resetPassword: { path: "/reset-password", label: "Reset Password" },
  verifyEmail: { path: "/verify-email", label: "Verify Email" },
  about: { path: "/about", label: "About Us" },
  contact: { path: "/contact", label: "Contact" },
  privacy: { path: "/privacy", label: "Privacy Policy" },
  terms: { path: "/terms", label: "Terms" },
};

// -----------------------------
// Role-specific dashboard routes
// -----------------------------
export const ROLE_ROUTES: Record<string, RouteDef[]> = {
  buyer: [
    { path: "/buyer/free", label: "Buyer Dashboard" },
    { path: "/buyer/pro", label: "Buyer Pro Dashboard" },
    { path: "/buyer/recommendations", label: "Recommendations" },
  ],
  seller: [
    { path: "/seller/free", label: "Seller Dashboard" },
    { path: "/seller/pro", label: "Seller Pro Dashboard" },
  ],
  agent: [
    { path: "/agent/free", label: "Agent Dashboard" },
    { path: "/agent/pro", label: "Agent Pro Dashboard" },
  ],
  investor: [
    { path: "/investor/free", label: "Investor Dashboard" },
    { path: "/investor/pro", label: "Investor Pro Dashboard" },
  ],
  msme_owner: [
    { path: "/MSMEowner/free", label: "MSME Owner Dashboard" },
    { path: "/MSMEowner/pro", label: "MSME Owner Pro Dashboard" },
  ],
  admin: [{ path: "/admin", label: "Admin Dashboard" }],
  superadmin: [{ path: "/superadmin", label: "Superadmin Dashboard" }],
};

// -----------------------------
// Feature module routes
// -----------------------------
export const FEATURE_ROUTES: Record<string, RouteDef> = {
  businessLoans: { path: "/business-loans", label: "Business Loans" },
  loanApplication: { path: "/business-loans/apply", label: "Apply for Loan" },
  loanStatus: { path: "/business-loans/status", label: "Loan Status" },
  businessValuation: { path: "/business-valuation", label: "Business Valuation" },
  exitStrategy: { path: "/exit-strategy", label: "Exit Strategy" },
  marketLinkage: { path: "/market-linkage", label: "Market Linkage" },
  compliance: { path: "/compliance", label: "Compliance" },
  leadershipTraining: { path: "/leadership-training", label: "Leadership Training" },
};

// -----------------------------
// Admin & Superadmin routes
// -----------------------------
export const ADMIN_ROUTES: Record<string, RouteDef> = {
  dashboard: { path: "/admin/dashboard", label: "Admin Dashboard" },
  users: { path: "/admin/users", label: "User Management" },
  features: { path: "/admin/features", label: "Feature Flags" },
};

export const SUPERADMIN_ROUTES: Record<string, RouteDef> = {
  dashboard: { path: "/superadmin/dashboard", label: "Superadmin Dashboard" },
  systemHealth: { path: "/superadmin/health", label: "System Health" },
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
