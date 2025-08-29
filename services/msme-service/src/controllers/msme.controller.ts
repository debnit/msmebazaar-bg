import * as service from "../services/msme.service";
import type { Request, Response } from "express";
import { getSessionUser } from "@msmebazaar/shared/auth";

// Helper: ensure requester is authenticated
function requireUser(req: Request) {
  const user = getSessionUser(req);
  if (!user || !user.id) throw Object.assign(new Error("Authentication required"), { status: 401 });
  return user;
}

// CREATE
// - Overrides ownerId from session user, ignoring any provided ownerId in payload
// - Enforces single MSME per owner for a given GST (business rule in service)
export const createMsme = async (req: Request & { validated?: any }, res: Response) => {
  try {
    const user = requireUser(req);
    const payload = { ...(req.validated || req.body || {}), ownerId: user.id };
    const msme = await service.createMsme(payload);
    res.status(201).json({ success: true, data: msme });
  } catch (e: any) {
    res.status(e.status || 400).json({ success: false, message: e.message || "Failed to create MSME" });
  }
};

// READ single
// - Only owner can read their MSME (extendable later with admin role checks)
export const getMsme = async (req: Request, res: Response) => {
  try {
    const user = requireUser(req);
    const msme = await service.getMsme(req.params.id);
    if (!msme) return res.status(404).json({ success: false, message: "MSME not found" });
    if (msme.ownerId !== user.id) return res.status(403).json({ success: false, message: "Access denied" });
    res.json({ success: true, data: msme });
  } catch (e: any) {
    res.status(e.status || 400).json({ success: false, message: e.message || "Failed to fetch MSME" });
  }
};

// READ all for owner
// - Supports /owner/me to fetch current user's MSMEs
// - If explicit ownerId provided, must match current user (extend later with admin bypass)
export const getMsmesByOwner = async (req: Request, res: Response) => {
  try {
    const user = requireUser(req);
    const ownerParam = req.params.ownerId;
    const ownerId = ownerParam === "me" ? user.id : ownerParam;
    if (ownerId !== user.id) return res.status(403).json({ success: false, message: "Access denied" });
    const msmes = await service.getMsmesByOwner(ownerId);
    res.json({ success: true, data: msmes });
  } catch (e: any) {
    res.status(e.status || 400).json({ success: false, message: e.message || "Failed to fetch MSMEs" });
  }
};

// UPDATE
// - Only owner can update their MSME
export const updateMsme = async (req: Request & { validated?: any }, res: Response) => {
  try {
    const user = requireUser(req);
    const msme = await service.getMsme(req.params.id);
    if (!msme) return res.status(404).json({ success: false, message: "MSME not found" });
    if (msme.ownerId !== user.id) return res.status(403).json({ success: false, message: "Access denied" });

    const updated = await service.updateMsme(req.params.id, req.validated || req.body || {});
    res.json({ success: true, data: updated });
  } catch (e: any) {
    res.status(e.status || 400).json({ success: false, message: e.message || "Failed to update MSME" });
  }
};

// DELETE
// - Only owner can delete their MSME
export const deleteMsme = async (req: Request, res: Response) => {
  try {
    const user = requireUser(req);
    const msme = await service.getMsme(req.params.id);
    if (!msme) return res.status(404).json({ success: false, message: "MSME not found" });
    if (msme.ownerId !== user.id) return res.status(403).json({ success: false, message: "Access denied" });

    await service.deleteMsme(req.params.id);
    res.json({ success: true, message: "MSME deleted" });
  } catch (e: any) {
    res.status(e.status || 400).json({ success: false, message: e.message || "Failed to delete MSME" });
  }
};
