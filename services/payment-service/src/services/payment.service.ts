import prisma from "../db/prismaClient";

export async function createPayment(userId: string, data: any) {
  return prisma.payment.create({
    data: {
      userId,
      ...data,
      status: "initiated",
    },
  });
}

export async function updatePaymentStatus(paymentId: string, status: string, gatewayRef?: string) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { status, gatewayRef },
  });
}
