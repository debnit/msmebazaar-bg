import prisma from "../db/prismaClient";
import { logger } from "../utils/logger";

interface KycData { panNumber: string; gstNumber?: string }
interface KycFiles { pan: any; gst?: any }

export class KycService {
  static async saveKyc(userId: string, data: KycData, files: KycFiles) {
    // TODO: upload files to storage (S3/local). For now, persist metadata and buffer length.
    const panMeta = files.pan ? { filename: files.pan.originalname, size: files.pan.size } : null;
    const gstMeta = files.gst ? { filename: files.gst.originalname, size: files.gst.size } : null;

    const upsert = await prisma.userKyc.upsert({
      where: { userId },
      update: {
        panNumber: data.panNumber,
        gstNumber: data.gstNumber || null,
        panMeta,
        gstMeta,
        status: "PENDING",
      },
      create: {
        userId,
        panNumber: data.panNumber,
        gstNumber: data.gstNumber || null,
        panMeta,
        gstMeta,
        status: "PENDING",
      },
    });

    logger.info("KYC saved", { userId });
    return upsert;
  }
}
