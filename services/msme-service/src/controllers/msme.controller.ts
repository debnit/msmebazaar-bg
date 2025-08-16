import * as service from "../services/msme.service";
import { Request, Response } from "express";

// CREATE
export const createMsme = async (req: Request & { validated?: any }, res: Response) => {
  try {
    const msme = await service.createMsme(req.validated);
    res.status(201).json({ success: true, data: msme });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// READ single
export const getMsme = async (req: Request, res: Response) => {
  const msme = await service.getMsme(req.params.id);
  if (!msme) return res.status(404).json({ success: false, message: "MSME not found." });
  res.json({ success: true, data: msme });
};

// READ all for owner
export const getMsmesByOwner = async (req: Request, res: Response) => {
  const msmes = await service.getMsmesByOwner(req.params.ownerId);
  res.json({ success: true, data: msmes });
};

// UPDATE
export const updateMsme = async (req: Request & { validated?: any }, res: Response) => {
  try {
    const msme = await service.updateMsme(req.params.id, req.validated);
    res.json({ success: true, data: msme });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

// DELETE
export const deleteMsme = async (req: Request, res: Response) => {
  try {
    await service.deleteMsme(req.params.id);
    res.json({ success: true, message: "MSME deleted" });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
