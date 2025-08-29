import { Request, Response, NextFunction } from 'express';
import { ExitService } from '../services/exit.service';
import { getSessionUser } from '@msmebazaar/shared/auth';

export const listPrograms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const result = await ExitService.listPrograms(user);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const expressInterest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ error: 'Authentication required' });
    const { programId, notes } = req.body;
    if (!programId) return res.status(400).json({ error: 'programId is required' });
    const result = await ExitService.expressInterest(user, programId, notes);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
