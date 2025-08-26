
/**
 * components/navbar/navbar-links.tsx
 * Centralized navbar links and roles-aware link builder
 */
import { FeatureKey } from "../../types/features";

export interface NavLink {
  label: string;
  href: string;
  icon?: string;
  featureKey?: FeatureKey; // optional gating key
  proOnly?: boolean;
  role?: string; // specific role this link is for
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  
  // Role-specific links
  { label: "Buyer", href: "/buyer/free", role: "buyer" },
  { label: "Seller", href: "/seller/free", role: "seller" },
  { label: "Agent", href: "/agent/free", role: "agent" },
  { label: "Investor", href: "/investor/free", role: "investor" },
  { label: "Admin", href: "/admin", role: "admin" },
  { label: "Super Admin", href: "/superadmin", role: "superadmin" },
  
  // Feature-specific links
  { label: "Business Loans", href: "/business-loans", featureKey: FeatureKey.BUSINESS_LOANS },
  { label: "Valuation", href: "/valuation", featureKey: FeatureKey.BUSINESS_VALUATION },
  { label: "Market Linkage", href: "/market-linkage", featureKey: FeatureKey.MARKET_LINKAGE },
  { label: "Networking", href: "/networking", featureKey: FeatureKey.NETWORKING },
];

// Role-specific navigation links
export const ROLE_NAV_LINKS: Record<string, NavLink[]> = {
  buyer: [
    { label: "Browse Listings", href: "/buyer/free" },
    { label: "Advanced Search", href: "/buyer/pro", proOnly: true },
    { label: "Saved Searches", href: "/buyer/pro", proOnly: true },
    { label: "Analytics", href: "/buyer/pro", proOnly: true },
  ],
  seller: [
    { label: "My Listings", href: "/seller/free" },
    { label: "Create Listing", href: "/seller/pro", proOnly: true },
    { label: "Inquiries", href: "/seller/free" },
    { label: "Analytics", href: "/seller/pro", proOnly: true },
  ],
  agent: [
    { label: "My Deals", href: "/agent/free" },
    { label: "CRM Dashboard", href: "/agent/pro", proOnly: true },
    { label: "Commissions", href: "/agent/free" },
    { label: "Analytics", href: "/agent/pro", proOnly: true },
  ],
  investor: [
    { label: "Opportunities", href: "/investor/free" },
    { label: "Early Access", href: "/investor/pro", proOnly: true },
    { label: "Portfolio", href: "/investor/pro", proOnly: true },
    { label: "Direct Chats", href: "/investor/pro", proOnly: true },
  ],
  admin: [
    { label: "Dashboard", href: "/admin" },
    { label: "User Management", href: "/admin" },
    { label: "Feature Flags", href: "/admin" },
    { label: "System Health", href: "/admin" },
  ],
  superadmin: [
    { label: "System Overview", href: "/superadmin" },
    { label: "Analytics", href: "/superadmin" },
    { label: "Infrastructure", href: "/superadmin" },
    { label: "Audit Logs", href: "/superadmin" },
  ],
};

export default NAV_LINKS;
