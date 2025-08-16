import type { Request, Response } from "express";
import * as service from "../services/compliance.service";

export const createDoc = async (
  req: Request & { user?: any; validated?: any },
  res: Response
) => {
  const doc = await service.createDoc(req.user.id, req.validated);
  res.status(201).json({ success: true, data: doc });
};

export const listUserDocs = async (req: Request & { user?: any }, res: Response) => {
  const docs = await service.listUserDocs(req.user.id);
  res.json({ success: true, data: docs });
};
