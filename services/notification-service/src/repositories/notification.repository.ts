import { prisma } from "../db/prismaClient";
import type { Notification } from "@prisma/client";

export const createNotification = async (data: Omit<Notification, "id" | "createdAt" | "updatedAt">) => {
  return prisma.notification.create({ data });
};

export const getNotificationsByUser = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const markNotificationAsRead = async (id: string, userId: string) => {
  // Ensures marking only their own notifications
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
};
