import prisma from "../db/prismaClient";

export async function createPayment(data: Record<string, any>) {
  return prisma.payment.create({ data });
}

export async function updatePaymentStatus(paymentId: string, status: string, gatewayRef?: string) {
  return prisma.payment.update({
    where: { id: paymentId },
    data: { status, gatewayRef },
  });
}

export async function getPaymentById(paymentId: string) {
  return prisma.payment.findUnique({ where: { id: paymentId } });
}
