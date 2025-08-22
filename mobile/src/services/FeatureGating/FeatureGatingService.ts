import { UserRole } from "@shared/types/feature";

export interface FeatureLimit {
  daily?: number;
  monthly?: number;
  total?: number;
}

export interface RoleFeatureMatrix {
  [key: string]: {
    free: {
      features: string[];
      limits: Record<string, FeatureLimit>;
    };
    pro: {
      features: string[];
      limits: Record<string, FeatureLimit>;
    };
  };
}

export const ROLE_SERVICE_MATRIX: RoleFeatureMatrix = {
  buyer: {
    free: {
      features: ['browse_listings', 'search_msmes', 'contact_sellers'],
      limits: {
        contact_sellers: { daily: 5 },
        saved_listings: { total: 10 },
        search_filters: { total: 3 }
      }
    },
    pro: {
      features: ['browse_listings', 'search_msmes', 'contact_sellers', 'advanced_search', 'unlimited_messaging', 'priority_support'],
      limits: {
        contact_sellers: { daily: -1 }, // unlimited
        saved_listings: { total: -1 },
        search_filters: { total: -1 }
      }
    }
  },
  seller: {
    free: {
      features: ['post_listing', 'basic_analytics', 'respond_inquiries'],
      limits: {
        post_listing: { total: 1 },
        analytics_depth: { total: 1 },
        inquiry_responses: { daily: 10 }
      }
    },
    pro: {
      features: ['post_listing', 'basic_analytics', 'respond_inquiries', 'multiple_listings', 'advanced_analytics', 'featured_boost'],
      limits: {
        post_listing: { total: -1 },
        analytics_depth: { total: -1 },
        inquiry_responses: { daily: -1 }
      }
    }
  },
  investor: {
    free: {
      features: ['view_opportunities', 'express_interest'],
      limits: {
        view_opportunities: { daily: 20 },
        express_interest: { daily: 3 }
      }
    },
    pro: {
      features: ['view_opportunities', 'express_interest', 'early_access', 'direct_chat'],
      limits: {
        view_opportunities: { daily: -1 },
        express_interest: { daily: -1 }
      }
    }
  },
  agent: {
    free: {
      features: ['connect_buyer_seller', 'earn_commission'],
      limits: {
        active_deals: { total: 5 },
        commission_rate: { total: 2 } // 2%
      }
    },
    pro: {
      features: ['connect_buyer_seller', 'earn_commission', 'manage_multiple_deals', 'crm_dashboard'],
      limits: {
        active_deals: { total: -1 },
        commission_rate: { total: 5 } // 5%
      }
    }
  },
  msmeowner: {
    free: {
      features: ['business_tools', 'loan_application'],
      limits: {
        loan_applications: { monthly: 2 },
        business_valuation: { total: 0 }
      }
    },
    pro: {
      features: ['business_tools', 'loan_application', 'priority_processing', 'ai_valuation'],
      limits: {
        loan_applications: { monthly: -1 },
        business_valuation: { total: -1 }
      }
    }
  }
};

export class FeatureGatingService {
  static canAccessFeature(userRole: string, isPro: boolean, feature: string): boolean {
    const roleMatrix = ROLE_SERVICE_MATRIX[userRole.toLowerCase()];
    if (!roleMatrix) return false;
    
    const tier = isPro ? roleMatrix.pro : roleMatrix.free;
    return tier.features.includes(feature);
  }
  
  static getFeatureLimit(userRole: string, isPro: boolean, feature: string): FeatureLimit | null {
    const roleMatrix = ROLE_SERVICE_MATRIX[userRole.toLowerCase()];
    if (!roleMatrix) return null;
    
    const tier = isPro ? roleMatrix.pro : roleMatrix.free;
    return tier.limits[feature] || null;
  }
  
  static hasReachedLimit(userRole: string, isPro: boolean, feature: string, currentUsage: number, period: 'daily' | 'monthly' | 'total' = 'total'): boolean {
    const limit = this.getFeatureLimit(userRole, isPro, feature);
    if (!limit) return false;
    
    const maxLimit = limit[period];
    if (maxLimit === undefined || maxLimit === -1) return false; // unlimited
    
    return currentUsage >= maxLimit;
  }
  
  static getUpgradeMessage(userRole: string, feature: string): string {
    const messages = {
      buyer: {
        contact_sellers: "Upgrade to Pro for unlimited seller messaging and priority support!",
        advanced_search: "Get Pro for AI-powered search filters and better results!",
        saved_listings: "Pro users can save unlimited listings and get alerts!"
      },
      seller: {
        post_listing: "Upgrade to Pro to post unlimited listings and boost visibility!",
        advanced_analytics: "Get detailed insights and analytics with Pro membership!",
        featured_boost: "Pro sellers get featured placement and 5x more visibility!"
      },
      investor: {
        view_opportunities: "Pro investors get unlimited access to all opportunities!",
        early_access: "Get early access to hot deals before others with Pro!"
      },
      agent: {
        active_deals: "Manage unlimited deals and earn higher commissions with Pro!",
        crm_dashboard: "Get advanced CRM tools and pipeline management with Pro!"
      },
      msmeowner: {
        loan_applications: "Pro members get priority loan processing and higher approval rates!",
        ai_valuation: "Get AI-powered business valuation and growth insights with Pro!"
      }
    };
    
    return messages[userRole]?.[feature] || "Upgrade to Pro for unlimited access and premium features!";
  }
}