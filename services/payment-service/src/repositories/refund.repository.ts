// src/repositories/refund.repository.ts

import prisma from "../db/prismaClient";
import { RefundStatus } from "@prisma/client";

export class RefundRepository {
  static async updateStatus(refundId: string, status: RefundStatus) {
    return prisma.refund.update({
      where: { id: refundId },
      data: { status },
    });
  }
}
