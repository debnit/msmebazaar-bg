
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
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Business Loans", href: "/business-loans", featureKey: FeatureKey.BUSINESS_LOANS },
  { label: "Valuation", href: "/valuation", featureKey: FeatureKey.BUSINESS_VALUATION },
  { label: "Market Linkage", href: "/market-linkage", featureKey: FeatureKey.MARKET_LINKAGE },
  { label: "Networking", href: "/networking", featureKey: FeatureKey.NETWORKING },
];
export default NAV_LINKS;
