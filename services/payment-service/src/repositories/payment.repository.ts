import prisma, { Prisma } from "../db/prismaClient";
import { Payment, PaymentStatus } from "@prisma/client";
import { logger } from "../utils/logger";

export class PaymentRepository {
  async create(data: Prisma.PaymentCreateInput, tx?: Prisma.TransactionClient): Promise<Payment> {
    try {
      if (tx) {
        return await tx.payment.create({ data });
      }
      return await prisma.payment.create({ data });
    } catch (error) {
      logger.error("Failed to create payment", { error });
      throw error;
    }
  }

  async update(
    where: Prisma.PaymentWhereUniqueInput,
    data: Prisma.PaymentUpdateInput,
    tx?: Prisma.TransactionClient
  ): Promise<Payment> {
    try {
      if (tx) {
        return await tx.payment.update({ where, data });
      }
      return await prisma.payment.update({ where, data });
    } catch (error) {
      logger.error("Failed to update payment", { error });
      throw error;
    }
  }

  async findById(id: string): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({ where: { id } });
    } catch (error) {
      logger.error("Failed to find payment by id", { error });
      throw error;
    }
  }

  async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
    try {
      return await prisma.payment.findUnique({ where: { razorpayOrderId: orderId } });
    } catch (error) {
      logger.error("Failed to find payment by razorpay order id", { error });
      throw error;
    }
  }
}
