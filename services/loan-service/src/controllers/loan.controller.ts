import { Request, Response, NextFunction } from 'express';
import { LoanService } from '../services/loan.service';
import { getSessionUser } from '@msmebazaar/shared/auth';
import { requireRole } from '@msmebazaar/shared/middleware/auth';
import { UserRole } from '@msmebazaar/types/feature';
import { logger } from '../utils/logger';

export const createLoanApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { loanAmount, purpose, tenureMonths, businessType, annualRevenue, creditScore } = req.body;

    // Validate required fields
    if (!loanAmount || !purpose || !tenureMonths || !businessType || !annualRevenue) {
      return res.status(400).json({ 
        error: 'loanAmount, purpose, tenureMonths, businessType, and annualRevenue are required' 
      });
    }

    const result = await LoanService.createLoanApplication(user, {
      loanAmount,
      purpose,
      tenureMonths,
      businessType,
      annualRevenue,
      creditScore
    });

    res.status(201).json(result);
  } catch (error) {
    logger.error('Create loan application controller error', { error });
    next(error);
  }
};

export const submitLoanApplication = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await LoanService.submitLoanApplication(user, applicationId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Submit loan application controller error', { error });
    next(error);
  }
};

export const getLoanOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await LoanService.getLoanOffers(user, applicationId);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get loan offers controller error', { error });
    next(error);
  }
};

export const getBusinessValuation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await LoanService.getBusinessValuation(user);

    if (!result.success && result.data?.upgradeRequired) {
      return res.status(403).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get business valuation controller error', { error });
    next(error);
  }
};

export const getUserLoanApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await LoanService.getUserLoanApplications(user);

    res.json(result);
  } catch (error) {
    logger.error('Get user loan applications controller error', { error });
    next(error);
  }
};

export const getLoanApplicationDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { applicationId } = req.params;

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    const result = await LoanService.getLoanApplicationDetails(user, applicationId);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (error) {
    logger.error('Get loan application details controller error', { error });
    next(error);
  }
};

export const uploadDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { applicationId } = req.params;
    const { documents } = req.body;

    if (!applicationId) {
      return res.status(400).json({ error: 'Application ID is required' });
    }

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: 'Documents array is required' });
    }

    const result = await LoanService.uploadDocuments(user, applicationId, documents);

    res.json(result);
  } catch (error) {
    logger.error('Upload documents controller error', { error });
    next(error);
  }
};

export const calculateLoanEligibility = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { loanAmount, tenureMonths } = req.body;

    if (!loanAmount || !tenureMonths) {
      return res.status(400).json({ error: 'loanAmount and tenureMonths are required' });
    }

    const result = await LoanService.calculateLoanEligibility(user, loanAmount, tenureMonths);

    res.json(result);
  } catch (error) {
    logger.error('Calculate loan eligibility controller error', { error });
    next(error);
  }
};
