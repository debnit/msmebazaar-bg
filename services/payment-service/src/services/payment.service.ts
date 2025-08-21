import Razorpay from "razorpay";
import { env } from "../config/env";
import * as paymentRepo from "../repositories/payment.repository";

const razorpayClient = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export async function createRazorpayOrder(userId: string, amountInPaise: number, currency = "INR", receipt?: string) {
  const options = {
    amount: amountInPaise, // in paise
    currency,
    receipt,
    payment_capture: 1,
  };

  const order = await razorpayClient.orders.create(options);

  const paymentRecord = await paymentRepo.createPayment({
    userId,
    amount: amountInPaise / 100,
    currency,
    status: "created",
    razorpayOrderId: order.id,
  });

  return { order, paymentRecord };
}

export async function updatePaymentStatus(_order_id: any, _arg1: string, _id: any) {
  throw new Error("Function not implemented.");
}
