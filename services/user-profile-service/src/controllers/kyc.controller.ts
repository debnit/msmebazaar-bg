import { Request, Response, NextFunction } from "express";
import { getSessionUser } from "@shared/auth";
import { z } from "zod";
import { kycUploadSchema } from "@shared/validation/kyc.schema";
import { KycService } from "../services/kyc.service";

export async function uploadKyc(req: Request, res: Response, next: NextFunction) {
  try {
    const user = getSessionUser(req);
    if (!user) return res.status(401).json({ success: false, message: "Authentication required" });

    const body = (req.body || {}) as any;
    const parsed = kycUploadSchema.safeParse({ panNumber: body.panNumber, gstNumber: body.gstNumber });
    if (!parsed.success) {
      return res.status(422).json({ success: false, message: "Invalid KYC fields", errors: parsed.error.flatten() });
    }

    const panFile = (req as any).files?.panDocument?.[0];
    const gstFile = (req as any).files?.gstDocument?.[0];

    if (!panFile) {
      return res.status(400).json({ success: false, message: "PAN document is required" });
    }

    const result = await KycService.saveKyc(user.id, parsed.data, {
      pan: panFile,
      gst: gstFile,
    });

    return res.status(201).json({ success: true, message: "KYC saved", data: result });
  } catch (err) {
    next(err);
  }
}
