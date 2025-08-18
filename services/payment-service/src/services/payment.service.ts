import * as paymentRepo from "../repositories/payment.repository";

export async function createPayment(userId: string, data: any) {
  return paymentRepo.createPayment({
    userId,
    ...data,
    status: "initiated",
  });
}

export async function updatePaymentStatus(paymentId: string, status: string, gatewayRef?: string) {
  return paymentRepo.updatePaymentStatus(paymentId, status, gatewayRef);
}
