/**
 * Centralized route constants and helper functions for MSMEBazaar navigation
 * Provides type-safe routing with dynamic parameter support
 */

/**
 * Public routes (no authentication required)
 */
export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",
} as const

/**
 * Authentication routes
 */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  LOGOUT: "/logout",
} as const

/**
 * Onboarding routes
 */
export const ONBOARDING_ROUTES = {
  WELCOME: "/onboarding-welcome",
  PROFILE: "/onboarding",
  PAYMENT: "/onboarding/payment",
  SUCCESS: "/onboarding/success",
  COMPLETE: "/onboarding/complete",
} as const

/**
 * Dashboard routes
 */
export const DASHBOARD_ROUTES = {
  HOME: "/dashboard",
  PROFILE: "/dashboard/profile",
  SETTINGS: "/dashboard/settings",
  NOTIFICATIONS: "/dashboard/notifications",
  BILLING: "/dashboard/billing",
  SUPPORT: "/dashboard/support",
} as const

/**
 * Feature module routes
 */
export const FEATURE_ROUTES = {
  // Business Loans
  BUSINESS_LOANS: "/business-loans",
  LOAN_APPLICATION: "/business-loans/apply",
  LOAN_STATUS: "/business-loans/status",
  LOAN_DOCUMENTS: "/business-loans/documents",
  LOAN_HISTORY: "/business-loans/history",

  // Business Valuation
  BUSINESS_VALUATION: "/business-valuation",
  VALUATION_BASIC: "/business-valuation/basic",
  VALUATION_DETAILED: "/business-valuation/detailed",
  VALUATION_REPORTS: "/business-valuation/reports",

  // Exit Strategy
  EXIT_STRATEGY: "/exit-strategy",
  NAVARAMBH_APPLY: "/exit-strategy/navarambh",
  EXIT_PLANNING: "/exit-strategy/planning",
  EXIT_MARKETPLACE: "/exit-strategy/marketplace",

  // Market Linkage
  MARKET_LINKAGE: "/market-linkage",
  MARKET_BROWSE: "/market-linkage/browse",
  RAW_MATERIALS: "/market-linkage/raw-materials",
  SUPPLIERS: "/market-linkage/suppliers",
  BUYERS: "/market-linkage/buyers",

  // MSME Networking
  MSME_NETWORKING: "/msme-networking",
  NETWORKING_FEED: "/msme-networking/feed",
  NETWORKING_EVENTS: "/msme-networking/events",
  NETWORKING_GROUPS: "/msme-networking/groups",

  // Compliance
  COMPLIANCE: "/compliance",
  COMPLIANCE_GUIDE: "/compliance/guide",
  COMPLIANCE_TRACKER: "/compliance/tracker",
  COMPLIANCE_DOCUMENTS: "/compliance/documents",

  // Plant & Machinery
  PLANT_MACHINERY: "/plant-machinery-installation",
  MACHINERY_REQUEST: "/plant-machinery-installation/request",
  MACHINERY_CATALOG: "/plant-machinery-installation/catalog",
  INSTALLATION_STATUS: "/plant-machinery-installation/status",

  // Leadership Training
  LEADERSHIP_TRAINING: "/leadership-training",
  TRAINING_CATALOG: "/leadership-training/catalog",
  TRAINING_PROGRESS: "/leadership-training/progress",
  TRAINING_CERTIFICATES: "/leadership-training/certificates",
} as const

/**
 * Role-specific dashboard routes
 */
export const ROLE_ROUTES = {
  // Multi-role dashboard
  MULTI_ROLE: "/roles",

  // MSME Owner
  MSME_OWNER: "/msme-owner",
  MSME_DASHBOARD: "/msme-owner/dashboard",

  // Buyer
  BUYER: "/buyer",
  BUYER_DASHBOARD: "/buyer/dashboard",
  BUYER_ORDERS: "/buyer/orders",
  BUYER_SUPPLIERS: "/buyer/suppliers",

  // Seller
  SELLER: "/seller",
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_ORDERS: "/seller/orders",

  // Investor
  INVESTOR: "/investor",
  INVESTOR_DASHBOARD: "/investor/dashboard",
  INVESTOR_PORTFOLIO: "/investor/portfolio",
  INVESTOR_DEALS: "/investor/deals",

  // Agent
  AGENT: "/agent",
  AGENT_DASHBOARD: "/agent/dashboard",
  AGENT_REFERRALS: "/agent/referrals",
  AGENT_EARNINGS: "/agent/earnings",
  AGENT_WITHDRAW: "/agent/withdraw",

  // Founder
  FOUNDER: "/founder",
  FOUNDER_DASHBOARD: "/founder/dashboard",
  FOUNDER_VENTURES: "/founder/ventures",
} as const

/**
 * Admin routes
 */
export const ADMIN_ROUTES = {
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  USER_MANAGEMENT: "/admin/users",
  FEATURE_FLAGS: "/admin/features",
  ANALYTICS: "/admin/analytics",
  SUPPORT_TICKETS: "/admin/support",
  SYSTEM_SETTINGS: "/admin/settings",
} as const

/**
 * Super Admin routes
 */
export const SUPER_ADMIN_ROUTES = {
  SUPER_ADMIN: "/super-admin",
  SUPER_ADMIN_DASHBOARD: "/super-admin/dashboard",
  SYSTEM_HEALTH: "/super-admin/health",
  DATABASE_MANAGEMENT: "/super-admin/database",
  AUDIT_LOGS: "/super-admin/audit",
  PLATFORM_SETTINGS: "/super-admin/platform",
} as const

/**
 * All routes combined
 */
export const ROUTES = {
  ...PUBLIC_ROUTES,
  ...AUTH_ROUTES,
  ...ONBOARDING_ROUTES,
  ...DASHBOARD_ROUTES,
  ...FEATURE_ROUTES,
  ...ROLE_ROUTES,
  ...ADMIN_ROUTES,
  ...SUPER_ADMIN_ROUTES,
} as const

/**
 * Route parameter types
 */
export interface RouteParams {
  id?: string
  slug?: string
  userId?: string
  applicationId?: string
  reportId?: string
  orderId?: string
  productId?: string
  dealId?: string
  ticketId?: string
}

/**
 * Route helper functions
 */

/**
 * Build route with parameters
 */
export function buildRoute(route: string, params?: RouteParams): string {
  let builtRoute = route

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        builtRoute = builtRoute.replace(`[${key}]`, value.toString())
        builtRoute = builtRoute.replace(`:${key}`, value.toString())
      }
    })
  }

  return builtRoute
}

/**
 * Check if route is public (no auth required)
 */
export function isPublicRoute(pathname: string): boolean {
  return Object.values(PUBLIC_ROUTES).includes(pathname as any)
}

/**
 * Check if route is auth route
 */
export function isAuthRoute(pathname: string): boolean {
  return Object.values(AUTH_ROUTES).includes(pathname as any)
}

/**
 * Check if route requires authentication
 */
export function requiresAuth(pathname: string): boolean {
  return !isPublicRoute(pathname) && !isAuthRoute(pathname)
}

/**
 * Check if route is onboarding route
 */
export function isOnboardingRoute(pathname: string): boolean {
  return pathname.startsWith("/onboarding")
}

/**
 * Check if route is dashboard route
 */
export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard")
}

/**
 * Check if route is admin route
 */
export function isAdminRoute(pathname: string): boolean {
  return pathname.startsWith("/admin") || pathname.startsWith("/super-admin")
}

/**
 * Check if route is role-specific
 */
export function isRoleRoute(pathname: string): boolean {
  const roleBasePaths = ["/msme-owner", "/buyer", "/seller", "/investor", "/agent", "/founder"]
  return roleBasePaths.some((path) => pathname.startsWith(path))
}

/**
 * Get redirect route after login based on user state
 */
export function getPostLoginRedirect(user: any): string {
  if (!user.onboardingCompleted) {
    return ONBOARDING_ROUTES.PROFILE
  }

  if (!user.isPro) {
    return ONBOARDING_ROUTES.WELCOME
  }

  // Check if user has multiple roles
  if (user.roles && user.roles.length > 1) {
    return ROLE_ROUTES.MULTI_ROLE
  }

  // Single role redirect
  const primaryRole = user.primaryRole || user.roles?.[0]
  switch (primaryRole) {
    case "msmeOwner":
      return DASHBOARD_ROUTES.HOME
    case "buyer":
      return ROLE_ROUTES.BUYER_DASHBOARD
    case "seller":
      return ROLE_ROUTES.SELLER_DASHBOARD
    case "investor":
      return ROLE_ROUTES.INVESTOR_DASHBOARD
    case "agent":
      return ROLE_ROUTES.AGENT_DASHBOARD
    case "founder":
      return ROLE_ROUTES.FOUNDER_DASHBOARD
    case "admin":
      return ADMIN_ROUTES.ADMIN_DASHBOARD
    case "superAdmin":
      return SUPER_ADMIN_ROUTES.SUPER_ADMIN_DASHBOARD
    default:
      return DASHBOARD_ROUTES.HOME
  }
}

/**
 * Get breadcrumb items for a route
 */
export function getBreadcrumbs(pathname: string): Array<{ label: string; href: string }> {
  const segments = pathname.split("/").filter(Boolean)
  const breadcrumbs: Array<{ label: string; href: string }> = []

  let currentPath = ""

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Convert segment to readable label
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")

    breadcrumbs.push({
      label,
      href: currentPath,
    })
  })

  return breadcrumbs
}

/**
 * Navigation menu structure
 */
export const NAVIGATION_MENU = {
  main: [
    { label: "Dashboard", href: DASHBOARD_ROUTES.HOME, icon: "LayoutDashboard" },
    { label: "Business Loans", href: FEATURE_ROUTES.BUSINESS_LOANS, icon: "CreditCard" },
    { label: "Valuation", href: FEATURE_ROUTES.BUSINESS_VALUATION, icon: "TrendingUp" },
    { label: "Market Linkage", href: FEATURE_ROUTES.MARKET_LINKAGE, icon: "Network" },
    { label: "Networking", href: FEATURE_ROUTES.MSME_NETWORKING, icon: "Users" },
  ],
  pro: [
    { label: "Exit Strategy", href: FEATURE_ROUTES.EXIT_STRATEGY, icon: "LogOut" },
    { label: "Compliance", href: FEATURE_ROUTES.COMPLIANCE, icon: "Shield" },
    { label: "Plant & Machinery", href: FEATURE_ROUTES.PLANT_MACHINERY, icon: "Settings" },
    { label: "Leadership Training", href: FEATURE_ROUTES.LEADERSHIP_TRAINING, icon: "GraduationCap" },
  ],
  account: [
    { label: "Profile", href: DASHBOARD_ROUTES.PROFILE, icon: "User" },
    { label: "Settings", href: DASHBOARD_ROUTES.SETTINGS, icon: "Settings" },
    { label: "Billing", href: DASHBOARD_ROUTES.BILLING, icon: "CreditCard" },
    { label: "Support", href: DASHBOARD_ROUTES.SUPPORT, icon: "HelpCircle" },
  ],
}

/**
 * Route metadata for SEO and page titles
 */
export const ROUTE_METADATA: Record<string, { title: string; description: string }> = {
  [ROUTES.HOME]: {
    title: "MSMEBazaar - Empowering MSMEs",
    description: "Complete business ecosystem for MSMEs including loans, valuation, and growth services",
  },
  [ROUTES.DASHBOARD]: {
    title: "Dashboard - MSMEBazaar",
    description: "Your MSME business dashboard",
  },
  [ROUTES.BUSINESS_LOANS]: {
    title: "Business Loans - MSMEBazaar",
    description: "Apply for business loans tailored for MSMEs",
  },
  [ROUTES.BUSINESS_VALUATION]: {
    title: "Business Valuation - MSMEBazaar",
    description: "Get your business valued by experts",
  },
  // Add more as needed
}
