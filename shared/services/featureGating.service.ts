import { UserRole, Feature, AccessLevel } from '../types/feature';
import { SessionUser } from '../types/user';

export interface FeatureAccessResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  proFeature?: boolean;
}

export interface RoleServiceMatrix {
  [key: string]: {
    basic: string[];
    pro: string[];
  };
}

/**
 * Role-Service Matrix Implementation
 * Maps each role to their basic and Pro-only services
 */
export const ROLE_SERVICE_MATRIX: RoleServiceMatrix = {
  [UserRole.BUYER]: {
    basic: [
      'Browse Listings',
      'Search MSMEs', 
      'Contact Sellers (limited messages)'
    ],
    pro: [
      'Advanced Search Filters',
      'Unlimited Messaging',
      'Priority Support'
    ]
  },
  [UserRole.SELLER]: {
    basic: [
      'Post 1 Listing',
      'Basic Analytics',
      'Respond to Inquiries'
    ],
    pro: [
      'Multiple Listings',
      'Advanced Analytics',
      'Featured Listing Boost'
    ]
  },
  [UserRole.INVESTOR]: {
    basic: [
      'View Investment Opportunities',
      'Express Interest'
    ],
    pro: [
      'Early Access to Opportunities',
      'Direct Investor-Seller Chat'
    ]
  },
  [UserRole.AGENT]: {
    basic: [
      'Connect Buyer & Seller (limited deals)',
      'Earn Basic Commission'
    ],
    pro: [
      'Manage Multiple Deals',
      'Higher Commission Rate',
      'CRM Dashboard'
    ]
  },
  [UserRole.MSME_OWNER]: {
    basic: [
      'Access Business Tools (templates, tips)',
      'Apply for Loans (basic form)'
    ],
    pro: [
      'Loan Application Priority Processing',
      'AI-based Business Valuation'
    ]
  },
  [UserRole.ADMIN]: {
    basic: [
      'User Management',
      'Basic Analytics'
    ],
    pro: [
      'Advanced Analytics',
      'Feature Toggles',
      'System Monitoring'
    ]
  },
  [UserRole.SUPER_ADMIN]: {
    basic: [
      'All Admin Features',
      'Database Operations'
    ],
    pro: [
      'System-wide Monitoring',
      'Advanced Security Controls'
    ]
  }
};

/**
 * Feature-to-Role mapping for granular access control
 */
export const FEATURE_ROLE_MAPPING: Record<Feature, { roles: UserRole[], proOnly: boolean }> = {
  [Feature.ADVANCED_ANALYTICS]: { roles: [UserRole.SELLER, UserRole.ADMIN], proOnly: true },
  [Feature.CUSTOM_REPORTS]: { roles: [UserRole.ADMIN], proOnly: true },
  [Feature.PRIORITY_SUPPORT]: { roles: [UserRole.BUYER, UserRole.SELLER, UserRole.ADMIN], proOnly: true },
  [Feature.PRO_UPGRADE]: { roles: Object.values(UserRole), proOnly: false },
  [Feature.PAYMENTS]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.PAYMENT_HISTORY]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.AI_BUSINESS_VALUATION]: { roles: [UserRole.MSME_OWNER, UserRole.INVESTOR], proOnly: true },
  [Feature.COMPLIANCE_CHECKLIST]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.EXIT_STRATEGY]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.MARKET_LINKAGE]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.BUSINESS_LOANS]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.CRM_PIPELINE]: { roles: [UserRole.AGENT], proOnly: true },
  [Feature.LEADERSHIP_TRAINING]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.DEALS_MARKETPLACE]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.ADMIN_FEATURE_TOGGLES]: { roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN], proOnly: true },
  [Feature.ADMIN_USER_MANAGEMENT]: { roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN], proOnly: false },
  [Feature.SUPERADMIN_MONITORING]: { roles: [UserRole.SUPER_ADMIN], proOnly: true },
  [Feature.SUPERADMIN_DATABASE_OPS]: { roles: [UserRole.SUPER_ADMIN], proOnly: true },
  [Feature.USER_PROFILE]: { roles: Object.values(UserRole), proOnly: false },
  [Feature.BUSINESS_PROFILE]: { roles: [UserRole.MSME_OWNER, UserRole.SELLER], proOnly: false },
  [Feature.BUSINESS_PROFILE_VERIFY]: { roles: [UserRole.MSME_OWNER, UserRole.SELLER], proOnly: false },
  [Feature.MSME_NETWORKING]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.B2B_MARKETPLACE]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.MESSAGING]: { roles: [UserRole.BUYER, UserRole.SELLER, UserRole.AGENT], proOnly: false },
  [Feature.ORDERS_MANAGEMENT]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.RECOMMENDATIONS]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.MATCHMAKING]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.SEARCHMSME]: { roles: [UserRole.BUYER, UserRole.INVESTOR], proOnly: false },
  [Feature.SEARCHMATCHMAKING]: { roles: [UserRole.BUYER, UserRole.SELLER], proOnly: false },
  [Feature.ADMIN_SERVICES]: { roles: [UserRole.ADMIN], proOnly: false },
  [Feature.SUPER_ADMIN_SERVICES]: { roles: [UserRole.SUPER_ADMIN], proOnly: false },
  [Feature.AGENT_SERVICES]: { roles: [UserRole.AGENT], proOnly: false },
  [Feature.INVESTOR_SERVICES]: { roles: [UserRole.INVESTOR], proOnly: false },
  [Feature.LOAN_SERVICES]: { roles: [UserRole.MSME_OWNER], proOnly: false },
  [Feature.BUYER_SERVICES]: { roles: [UserRole.BUYER], proOnly: false },
  [Feature.SELLER_SERVICES]: { roles: [UserRole.SELLER], proOnly: false }
};

export class FeatureGatingService {
  /**
   * Check if user has access to a specific feature
   */
  static checkFeatureAccess(user: SessionUser, feature: Feature): FeatureAccessResult {
    const featureConfig = FEATURE_ROLE_MAPPING[feature];
    
    if (!featureConfig) {
      return {
        hasAccess: false,
        reason: 'Feature not configured'
      };
    }

    // Check if user has any of the required roles
    const hasRequiredRole = user.roles.some(role => 
      featureConfig.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return {
        hasAccess: false,
        reason: 'Insufficient role permissions',
        proFeature: featureConfig.proOnly
      };
    }

    // Check Pro requirement
    if (featureConfig.proOnly && !user.isPro) {
      return {
        hasAccess: false,
        reason: 'Pro subscription required',
        upgradeRequired: true,
        proFeature: true
      };
    }

    return {
      hasAccess: true
    };
  }

  /**
   * Check if user has access to a service based on role-service matrix
   */
  static checkServiceAccess(user: SessionUser, service: string, isProService: boolean = false): FeatureAccessResult {
    // Find which roles have access to this service
    const rolesWithAccess: UserRole[] = [];
    
    Object.entries(ROLE_SERVICE_MATRIX).forEach(([role, services]) => {
      const allServices = [...services.basic, ...services.pro];
      if (allServices.some(s => s.toLowerCase().includes(service.toLowerCase()))) {
        rolesWithAccess.push(role as UserRole);
      }
    });

    if (rolesWithAccess.length === 0) {
      return {
        hasAccess: false,
        reason: 'Service not found in role matrix'
      };
    }

    // Check if user has any of the required roles
    const hasRequiredRole = user.roles.some(role => 
      rolesWithAccess.includes(role)
    );

    if (!hasRequiredRole) {
      return {
        hasAccess: false,
        reason: 'Insufficient role permissions',
        proFeature: isProService
      };
    }

    // Check Pro requirement for Pro services
    if (isProService && !user.isPro) {
      return {
        hasAccess: false,
        reason: 'Pro subscription required for this service',
        upgradeRequired: true,
        proFeature: true
      };
    }

    return {
      hasAccess: true
    };
  }

  /**
   * Get all available services for a user based on their roles and Pro status
   */
  static getUserServices(user: SessionUser): { basic: string[], pro: string[] } {
    const basicServices: string[] = [];
    const proServices: string[] = [];

    user.roles.forEach(role => {
      const roleServices = ROLE_SERVICE_MATRIX[role];
      if (roleServices) {
        basicServices.push(...roleServices.basic);
        if (user.isPro) {
          proServices.push(...roleServices.pro);
        }
      }
    });

    return {
      basic: [...new Set(basicServices)], // Remove duplicates
      pro: [...new Set(proServices)]
    };
  }

  /**
   * Get all features available to a user
   */
  static getUserFeatures(user: SessionUser): Feature[] {
    const availableFeatures: Feature[] = [];

    Object.entries(FEATURE_ROLE_MAPPING).forEach(([feature, config]) => {
      const hasRole = user.roles.some(role => config.roles.includes(role));
      const isProFeature = config.proOnly;
      
      if (hasRole && (!isProFeature || user.isPro)) {
        availableFeatures.push(feature as Feature);
      }
    });

    return availableFeatures;
  }

  /**
   * Check if user can upgrade to Pro
   */
  static canUpgradeToPro(user: SessionUser): boolean {
    // Users can upgrade to Pro if they're not already Pro
    return !user.isPro;
  }

  /**
   * Get upgrade recommendations for a user
   */
  static getUpgradeRecommendations(user: SessionUser): string[] {
    const recommendations: string[] = [];

    user.roles.forEach(role => {
      const roleServices = ROLE_SERVICE_MATRIX[role];
      if (roleServices && roleServices.pro.length > 0) {
        recommendations.push(...roleServices.pro);
      }
    });

    return [...new Set(recommendations)];
  }

  /**
   * Validate role-service matrix consistency
   */
  static validateMatrix(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if all roles have services defined
    Object.values(UserRole).forEach(role => {
      if (!ROLE_SERVICE_MATRIX[role]) {
        errors.push(`Role ${role} has no services defined`);
      }
    });

    // Check if all features have role mappings
    Object.values(Feature).forEach(feature => {
      if (!FEATURE_ROLE_MAPPING[feature]) {
        errors.push(`Feature ${feature} has no role mapping`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
