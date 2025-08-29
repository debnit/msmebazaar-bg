import { z } from "zod";

// Notification Creation Schema
export const notificationSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  type: z.enum([
    "INVESTMENT_UPDATE", "PAYMENT_CONFIRMATION", "PAYMENT_FAILED", "KYC_STATUS",
    "LOAN_STATUS", "INQUIRY_RECEIVED", "INQUIRY_RESPONSE", "LISTING_APPROVED",
    "LISTING_REJECTED", "PROFILE_UPDATE", "SECURITY_ALERT", "SYSTEM_MAINTENANCE",
    "MARKETING_CAMPAIGN", "RECOMMENDATION", "REMINDER", "WELCOME",
    "PASSWORD_RESET", "EMAIL_VERIFICATION", "TWO_FACTOR_AUTH"
  ]),
  title: z.string().min(1, "Title is required").max(200),
  message: z.string().min(1, "Message is required").max(1000),
  data: z.record(z.any()).optional(),
  channels: z.array(z.enum(["EMAIL", "SMS", "PUSH", "IN_APP", "WHATSAPP"])),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  scheduledFor: z.date().optional(),
  expiresAt: z.date().optional(),
  groupId: z.string().optional(),
  parentId: z.string().cuid().optional(),
});

// Notification Template Schema
export const notificationTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(100),
  type: z.enum([
    "INVESTMENT_UPDATE", "PAYMENT_CONFIRMATION", "PAYMENT_FAILED", "KYC_STATUS",
    "LOAN_STATUS", "INQUIRY_RECEIVED", "INQUIRY_RESPONSE", "LISTING_APPROVED",
    "LISTING_REJECTED", "PROFILE_UPDATE", "SECURITY_ALERT", "SYSTEM_MAINTENANCE",
    "MARKETING_CAMPAIGN", "RECOMMENDATION", "REMINDER", "WELCOME",
    "PASSWORD_RESET", "EMAIL_VERIFICATION", "TWO_FACTOR_AUTH"
  ]),
  subject: z.string().max(200).optional(),
  bodyText: z.string().min(1, "Body text is required"),
  bodyHtml: z.string().optional(),
  pushTitle: z.string().max(100).optional(),
  pushBody: z.string().max(200).optional(),
  smsText: z.string().max(160).optional(),
  variables: z.array(z.string()),
  category: z.enum(["TRANSACTIONAL", "MARKETING", "SECURITY", "SYSTEM", "NOTIFICATION"]),
  isActive: z.boolean().default(true),
});

// Notification Delivery Schema
export const notificationDeliverySchema = z.object({
  notificationId: z.string().cuid("Invalid notification ID"),
  templateId: z.string().cuid().optional(),
  channel: z.enum(["EMAIL", "SMS", "PUSH", "IN_APP", "WHATSAPP"]),
  recipient: z.string().min(1, "Recipient is required"),
  subject: z.string().max(200).optional(),
  content: z.string().min(1, "Content is required"),
  maxRetries: z.number().int().min(0).max(10).default(3),
});

// User Preferences Schema
export const userNotificationPreferencesSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  emailEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(true),
  inAppEnabled: z.boolean().default(true),
  marketing: z.boolean().default(true),
  transactional: z.boolean().default(true),
  security: z.boolean().default(true),
  system: z.boolean().default(true),
  quietHoursStart: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  quietHoursEnd: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  timezone: z.string().optional(),
  digestFrequency: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"]).default("NONE"),
});

// Notification Subscription Schema
export const notificationSubscriptionSchema = z.object({
  userId: z.string().cuid("Invalid user ID"),
  endpoint: z.string().url("Invalid endpoint URL"),
  p256dh: z.string().optional(),
  auth: z.string().optional(),
  deviceToken: z.string().optional(),
  deviceType: z.enum(["ANDROID", "IOS", "WEB", "DESKTOP"]).optional(),
  isActive: z.boolean().default(true),
});

// Bulk Notification Schema
export const bulkNotificationSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1, "At least one user ID is required"),
  templateId: z.string().cuid("Invalid template ID"),
  data: z.record(z.any()).optional(),
  channels: z.array(z.enum(["EMAIL", "SMS", "PUSH", "IN_APP", "WHATSAPP"])),
  scheduledFor: z.date().optional(),
});

// Update Schemas
export const updateNotificationSchema = z.object({
  read: z.boolean().optional(),
  readAt: z.date().optional(),
});

export const updateNotificationDeliverySchema = z.object({
  status: z.enum(["PENDING", "SENT", "DELIVERED", "FAILED", "BOUNCED", "READ", "CLICKED", "UNSUBSCRIBED"]),
  deliveredAt: z.date().optional(),
  failedAt: z.date().optional(),
  readAt: z.date().optional(),
  clickedAt: z.date().optional(),
  errorMessage: z.string().optional(),
  externalId: z.string().optional(),
});

// Types
export type NotificationInput = z.infer<typeof notificationSchema>;
export type NotificationTemplateInput = z.infer<typeof notificationTemplateSchema>;
export type NotificationDeliveryInput = z.infer<typeof notificationDeliverySchema>;
export type UserNotificationPreferencesInput = z.infer<typeof userNotificationPreferencesSchema>;
export type NotificationSubscriptionInput = z.infer<typeof notificationSubscriptionSchema>;
export type BulkNotificationInput = z.infer<typeof bulkNotificationSchema>;
export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
export type UpdateNotificationDeliveryInput = z.infer<typeof updateNotificationDeliverySchema>;