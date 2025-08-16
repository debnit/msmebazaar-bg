import type { Request, Response } from "express";
import * as service from "../services/loan.service";

export const loanCta = async (req: Request & { user?: any; validated?: any }, res: Response) => {
  const offer = await service.getLoanOffer(req.user.id, req.validated);
  res.json({ success: true, data: offer });
};

export const createLoan = async (req: Request & { user?: any; validated?: any }, res: Response) => {
  const application = await service.createApplication(req.user.id, req.validated);
  res.status(201).json({ success: true, data: application });
};

export const listLoans = async (req: Request & { user?: any }, res: Response) => {
  const loans = await service.listUserLoans(req.user.id);
  res.json({ success: true, data: loans });
};
