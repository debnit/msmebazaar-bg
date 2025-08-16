import * as repo from "../repositories/notification.repository";

export async function createNotification(userId: string, data: any) {
  // Optionally validate payload here
  return repo.createNotification({ ...data, userId });
}

export async function listNotifications(userId: string) {
  return repo.getNotificationsByUser(userId);
}

export async function markAsRead(notificationId: string, userId: string) {
  // Optionally: verify ownership before marking as read
  return repo.markNotificationAsRead(notificationId, userId);
}
