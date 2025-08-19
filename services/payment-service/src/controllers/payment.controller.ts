import { Request, Response } from "express";
import crypto from "crypto";
import * as paymentService from "../services/payment.service";
import { getUserIdFromReq } from "../utils/helpers";
import { env } from "../config/env";


export async function createRazorpayOrderController(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);
  const { amount } = req.body;

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const { order, paymentRecord } = await paymentService.createRazorpayOrder(userId, amount * 100); // convert to paise
    res.status(201).json({ order, paymentRecord });
  } catch (error) {
    console.error("Error creating Razorpay order", error);
    res.status(500).json({ error: "Could not create payment order" });
  }
}
const validateRazorpayWebhook = (req: Request) => {
  const secret = env.RAZORPAY_KEY_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  const body = JSON.stringify(req.body);
  shasum.update(body);
  const digest = shasum.digest("hex");
  return digest === req.headers["x-razorpay-signature"];
};

export async function razorpayWebhookController(req: Request, res: Response) {
  if (!validateRazorpayWebhook(req)) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "payment.captured") {
    const paymentEntity = payload.payment.entity;
    
    // Update payment status as captured/paid
    await paymentService.updatePaymentStatus(
      paymentEntity.order_id,
      "completed",
      paymentEntity.id
    );

    return res.status(200).json({ status: "ok" });
  }

  // Handle other events as needed
  return res.status(200).json({ status: "ignored" });
}