import { Request, Response, NextFunction } from 'express';
import { ValuationService } from '../services/valuation.service';
import { getSessionUser } from '@msmebazaar/shared/auth';

export const getValuation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { turnover } = req.body;
    if (typeof turnover !== 'number' || turnover <= 0) {
      return res.status(400).json({ error: 'Valid turnover is required' });
    }
    const result = await ValuationService.calculate(user, turnover);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
