import type { Request, Response } from "express";
import * as service from "../services/listing.service";

export const createListing = async (
  req: Request & { user?: any; validated?: any },
  res: Response
) => {
  const listing = await service.createListing(req.user.id, req.validated);
  res.status(201).json({ success: true, data: listing });
};

export const listMsme = async (
  req: Request & { user?: any },
  res: Response
) => {
  const listings = await service.listMsme(req.params.msmeId);
  res.json({ success: true, data: listings });
};
