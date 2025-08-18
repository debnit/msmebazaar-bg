import { Request, Response } from "express";
import { createPaymentSchema, updatePaymentStatusSchema } from "../validation/payment.schema";
import * as paymentService from "../services/payment.service";
import { Feature } from "../../../shared/config/featureFlagTypes";
import { requireFeature } from "../middlewares/featureGating";
import { getUserIdFromReq } from "../utils/helpers";

export async function createPaymentController(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);

  const parsed = createPaymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request data", details: parsed.error.flatten() });

  // Feature check handled via middleware, optionally check here again
  const payment = await paymentService.createPayment(userId, parsed.data);
  res.status(201).json(payment);
}

export async function updatePaymentStatusController(req: Request, res: Response) {
  const { paymentId } = req.params;

  const parsed = updatePaymentStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid request data", details: parsed.error.flatten() });

  const payment = await paymentService.updatePaymentStatus(paymentId, parsed.data.status, parsed.data.gatewayRef);
  res.json(payment);
}
