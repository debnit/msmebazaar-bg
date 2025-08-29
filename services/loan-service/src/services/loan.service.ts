import { PrismaClient } from '@prisma/client';
import { SessionUser } from '@msmebazaar/types/user';
import { FeatureGatingService } from '@msmebazaar/shared/services/featureGating.service';
import { Feature } from '@msmebazaar/types/feature';
import { UserRole } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export interface LoanApplication {
  id: string;
  userId: string;
  loanAmount: number;
  purpose: string;
  tenureMonths: number;
  businessType: string;
  annualRevenue: number;
  creditScore?: number;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  priorityLevel: 'NORMAL' | 'PRIORITY';
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoanOffer {
  id: string;
  applicationId: string;
  amount: number;
  interestRate: number;
  tenureMonths: number;
  processingFee: number;
  eligibilityScore: number;
  terms: string[];
  validUntil: string;
}

export interface BusinessValuation {
  id: string;
  userId: string;
  businessValue: number;
  confidence: number;
  factors: {
    revenue: number;
    growth: number;
    market: number;
    risk: number;
  };
  recommendations: string[];
  createdAt: string;
}

export interface LoanServiceResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class LoanService {
  /**
   * Create a new loan application (available to MSME Owners)
   */
  static async createLoanApplication(user: SessionUser, applicationData: Partial<LoanApplication>): Promise<LoanServiceResponse> {
    try {
      // Check if user has MSME Owner role
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can apply for loans');
      }

      const application = await prisma.loanApplication.create({
        data: {
          userId: user.id,
          loanAmount: applicationData.loanAmount!,
          purpose: applicationData.purpose!,
          tenureMonths: applicationData.tenureMonths!,
          businessType: applicationData.businessType!,
          annualRevenue: applicationData.annualRevenue!,
          creditScore: applicationData.creditScore,
          status: 'DRAFT',
          priorityLevel: user.isPro ? 'PRIORITY' : 'NORMAL',
          documents: applicationData.documents || []
        }
      });

      logger.info('Loan application created', { 
        applicationId: application.id, 
        userId: user.id,
        isPro: user.isPro 
      });

      return {
        success: true,
        message: 'Loan application created successfully',
        data: {
          application: {
            id: application.id,
            userId: application.userId,
            loanAmount: application.loanAmount,
            purpose: application.purpose,
            tenureMonths: application.tenureMonths,
            businessType: application.businessType,
            annualRevenue: application.annualRevenue,
            creditScore: application.creditScore,
            status: application.status,
            priorityLevel: application.priorityLevel,
            documents: application.documents,
            createdAt: application.createdAt.toISOString(),
            updatedAt: application.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Create loan application failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Submit loan application for review
   */
  static async submitLoanApplication(user: SessionUser, applicationId: string): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can submit loan applications');
      }

      const application = await prisma.loanApplication.findFirst({
        where: { id: applicationId, userId: user.id }
      });

      if (!application) {
        return {
          success: false,
          message: 'Loan application not found'
        };
      }

      if (application.status !== 'DRAFT') {
        return {
          success: false,
          message: 'Application can only be submitted from draft status'
        };
      }

      const updatedApplication = await prisma.loanApplication.update({
        where: { id: applicationId },
        data: { 
          status: 'SUBMITTED',
          updatedAt: new Date()
        }
      });

      // Publish notification for Pro users
      if (user.isPro) {
        await this.publishNotification({
          userId: user.id,
          type: 'loan-submitted-priority',
          message: 'Your priority loan application has been submitted and will be processed within 24 hours.'
        });
      } else {
        await this.publishNotification({
          userId: user.id,
          type: 'loan-submitted',
          message: 'Your loan application has been submitted and will be processed within 3-5 business days.'
        });
      }

      return {
        success: true,
        message: 'Loan application submitted successfully',
        data: {
          application: {
            id: updatedApplication.id,
            status: updatedApplication.status,
            priorityLevel: updatedApplication.priorityLevel,
            updatedAt: updatedApplication.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Submit loan application failed', { error, userId: user.id, applicationId });
      throw error;
    }
  }

  /**
   * Get loan offers based on application (Pro feature for priority processing)
   */
  static async getLoanOffers(user: SessionUser, applicationId: string): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can view loan offers');
      }

      // Check Pro access for priority processing
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.AI_BUSINESS_VALUATION);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'Priority loan processing requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      const application = await prisma.loanApplication.findFirst({
        where: { id: applicationId, userId: user.id }
      });

      if (!application) {
        return {
          success: false,
          message: 'Loan application not found'
        };
      }

      // Generate loan offers based on business profile and credit score
      const offers = await this.generateLoanOffers(application);

      return {
        success: true,
        message: 'Loan offers generated successfully',
        data: {
          offers: offers.map(offer => ({
            id: offer.id,
            applicationId: offer.applicationId,
            amount: offer.amount,
            interestRate: offer.interestRate,
            tenureMonths: offer.tenureMonths,
            processingFee: offer.processingFee,
            eligibilityScore: offer.eligibilityScore,
            terms: offer.terms,
            validUntil: offer.validUntil.toISOString()
          }))
        }
      };
    } catch (error) {
      logger.error('Get loan offers failed', { error, userId: user.id, applicationId });
      throw error;
    }
  }

  /**
   * Get AI-based business valuation (Pro-only feature)
   */
  static async getBusinessValuation(user: SessionUser): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can access business valuation');
      }

      // Check Pro access for AI valuation
      const accessResult = FeatureGatingService.checkFeatureAccess(user, Feature.AI_BUSINESS_VALUATION);
      if (!accessResult.hasAccess) {
        return {
          success: false,
          message: 'AI-based business valuation requires Pro subscription',
          data: { upgradeRequired: true }
        };
      }

      // Get business profile for valuation
      const businessProfile = await prisma.businessProfile.findUnique({
        where: { userId: user.id }
      });

      if (!businessProfile) {
        return {
          success: false,
          message: 'Business profile not found. Please complete your business profile first.'
        };
      }

      // Generate AI-based valuation
      const valuation = await this.generateBusinessValuation(businessProfile);

      return {
        success: true,
        message: 'Business valuation completed successfully',
        data: {
          valuation: {
            id: valuation.id,
            userId: valuation.userId,
            businessValue: valuation.businessValue,
            confidence: valuation.confidence,
            factors: valuation.factors,
            recommendations: valuation.recommendations,
            createdAt: valuation.createdAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get business valuation failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get user's loan applications
   */
  static async getUserLoanApplications(user: SessionUser): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can view loan applications');
      }

      const applications = await prisma.loanApplication.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        message: 'Loan applications retrieved successfully',
        data: {
          applications: applications.map(app => ({
            id: app.id,
            loanAmount: app.loanAmount,
            purpose: app.purpose,
            tenureMonths: app.tenureMonths,
            businessType: app.businessType,
            status: app.status,
            priorityLevel: app.priorityLevel,
            createdAt: app.createdAt.toISOString(),
            updatedAt: app.updatedAt.toISOString()
          }))
        }
      };
    } catch (error) {
      logger.error('Get user loan applications failed', { error, userId: user.id });
      throw error;
    }
  }

  /**
   * Get loan application details
   */
  static async getLoanApplicationDetails(user: SessionUser, applicationId: string): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can view loan application details');
      }

      const application = await prisma.loanApplication.findFirst({
        where: { id: applicationId, userId: user.id },
        include: {
          offers: true,
          documents: true
        }
      });

      if (!application) {
        return {
          success: false,
          message: 'Loan application not found'
        };
      }

      return {
        success: true,
        message: 'Loan application details retrieved successfully',
        data: {
          application: {
            id: application.id,
            loanAmount: application.loanAmount,
            purpose: application.purpose,
            tenureMonths: application.tenureMonths,
            businessType: application.businessType,
            annualRevenue: application.annualRevenue,
            creditScore: application.creditScore,
            status: application.status,
            priorityLevel: application.priorityLevel,
            documents: application.documents,
            offers: application.offers.map(offer => ({
              id: offer.id,
              amount: offer.amount,
              interestRate: offer.interestRate,
              tenureMonths: offer.tenureMonths,
              processingFee: offer.processingFee,
              eligibilityScore: offer.eligibilityScore,
              validUntil: offer.validUntil.toISOString()
            })),
            createdAt: application.createdAt.toISOString(),
            updatedAt: application.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Get loan application details failed', { error, userId: user.id, applicationId });
      throw error;
    }
  }

  /**
   * Upload documents for loan application
   */
  static async uploadDocuments(user: SessionUser, applicationId: string, documents: string[]): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can upload documents');
      }

      const application = await prisma.loanApplication.findFirst({
        where: { id: applicationId, userId: user.id }
      });

      if (!application) {
        return {
          success: false,
          message: 'Loan application not found'
        };
      }

      const updatedApplication = await prisma.loanApplication.update({
        where: { id: applicationId },
        data: {
          documents: [...application.documents, ...documents],
          updatedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Documents uploaded successfully',
        data: {
          application: {
            id: updatedApplication.id,
            documents: updatedApplication.documents,
            updatedAt: updatedApplication.updatedAt.toISOString()
          }
        }
      };
    } catch (error) {
      logger.error('Upload documents failed', { error, userId: user.id, applicationId });
      throw error;
    }
  }

  /**
   * Get loan eligibility calculator (basic feature)
   */
  static async calculateLoanEligibility(user: SessionUser, loanAmount: number, tenureMonths: number): Promise<LoanServiceResponse> {
    try {
      if (!user.roles.includes(UserRole.MSME_OWNER)) {
        throw new Error('Only MSME Owners can calculate loan eligibility');
      }

      // Basic eligibility calculation
      const businessProfile = await prisma.businessProfile.findUnique({
        where: { userId: user.id }
      });

      if (!businessProfile) {
        return {
          success: false,
          message: 'Business profile not found. Please complete your business profile first.'
        };
      }

      const eligibilityScore = this.calculateEligibilityScore(businessProfile, loanAmount, tenureMonths);
      const maxEligibleAmount = this.calculateMaxEligibleAmount(businessProfile);
      const recommendedTenure = this.calculateRecommendedTenure(loanAmount, businessProfile.annualRevenue);

      return {
        success: true,
        message: 'Loan eligibility calculated successfully',
        data: {
          eligibility: {
            score: eligibilityScore,
            maxEligibleAmount,
            recommendedTenure,
            isEligible: eligibilityScore >= 60,
            factors: {
              businessAge: businessProfile.businessAge || 0,
              annualRevenue: businessProfile.annualRevenue,
              creditScore: businessProfile.creditScore || 0
            }
          }
        }
      };
    } catch (error) {
      logger.error('Calculate loan eligibility failed', { error, userId: user.id });
      throw error;
    }
  }

  // Private helper methods
  private static async generateLoanOffers(application: any): Promise<LoanOffer[]> {
    // Mock implementation - in real scenario, this would call ML service
    const baseInterestRate = 12.5;
    const creditScore = application.creditScore || 650;
    const adjustedRate = baseInterestRate - (creditScore - 650) * 0.02;

    return [
      {
        id: `offer-${application.id}-1`,
        applicationId: application.id,
        amount: application.loanAmount,
        interestRate: Math.max(adjustedRate, 8.5),
        tenureMonths: application.tenureMonths,
        processingFee: application.loanAmount * 0.01,
        eligibilityScore: creditScore,
        terms: [
          'No prepayment penalty',
          'Flexible EMI options',
          'Quick disbursal within 48 hours'
        ],
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    ];
  }

  private static async generateBusinessValuation(businessProfile: any): Promise<BusinessValuation> {
    // Mock AI-based valuation - in real scenario, this would call ML service
    const baseValue = businessProfile.annualRevenue * 2;
    const growthFactor = 1.2; // 20% growth assumption
    const marketFactor = 1.1; // Market conditions
    const riskFactor = 0.9; // Risk adjustment

    const businessValue = baseValue * growthFactor * marketFactor * riskFactor;

    return {
      id: `valuation-${businessProfile.userId}`,
      userId: businessProfile.userId,
      businessValue: Math.round(businessValue),
      confidence: 85,
      factors: {
        revenue: businessProfile.annualRevenue,
        growth: 20,
        market: 10,
        risk: -10
      },
      recommendations: [
        'Consider expanding to new markets',
        'Optimize operational efficiency',
        'Strengthen customer relationships'
      ],
      createdAt: new Date()
    };
  }

  private static calculateEligibilityScore(businessProfile: any, loanAmount: number, tenureMonths: number): number {
    let score = 0;
    
    // Business age factor (0-25 points)
    const businessAge = businessProfile.businessAge || 0;
    score += Math.min(businessAge * 2, 25);
    
    // Revenue factor (0-35 points)
    const revenueRatio = loanAmount / businessProfile.annualRevenue;
    if (revenueRatio <= 0.5) score += 35;
    else if (revenueRatio <= 1) score += 25;
    else if (revenueRatio <= 2) score += 15;
    else score += 5;
    
    // Credit score factor (0-40 points)
    const creditScore = businessProfile.creditScore || 650;
    score += Math.min((creditScore - 300) / 5, 40);
    
    return Math.min(score, 100);
  }

  private static calculateMaxEligibleAmount(businessProfile: any): number {
    const annualRevenue = businessProfile.annualRevenue;
    const creditScore = businessProfile.creditScore || 650;
    
    let multiplier = 1;
    if (creditScore >= 750) multiplier = 2;
    else if (creditScore >= 650) multiplier = 1.5;
    else multiplier = 1;
    
    return Math.round(annualRevenue * multiplier);
  }

  private static calculateRecommendedTenure(loanAmount: number, annualRevenue: number): number {
    const ratio = loanAmount / annualRevenue;
    
    if (ratio <= 0.5) return 12;
    else if (ratio <= 1) return 24;
    else if (ratio <= 2) return 36;
    else return 60;
  }

  private static async publishNotification(notification: any): Promise<void> {
    // Mock notification publishing - in real scenario, this would call notification service
    logger.info('Notification published', notification);
  }
}
