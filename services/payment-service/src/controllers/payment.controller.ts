import { Request, Response } from "express";
import { z } from "zod";
import { createPaymentSchema } from "../schemas/payment.schema";
import { createPayment, updatePaymentStatus } from "../services/payment.service";
import { getUserIdFromReq } from "../utils/helpers";

export async function createPaymentController(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);
  const parse = createPaymentSchema.safeParse(req.body);
  if (!parse.success)
    return res.status(400).json({ error: "Invalid data", details: parse.error.flatten() });

  const payment = await createPayment(userId, parse.data);
  res.status(201).json(payment);
}

export async function updatePaymentStatusController(req: Request, res: Response) {
  const { paymentId } = req.params;
  const { status, gatewayRef } = req.body;
  const payment = await updatePaymentStatus(paymentId, status, gatewayRef);
  res.json(payment);
}
