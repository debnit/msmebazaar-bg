import prisma from "../db/prismaClient";
import type { UserProfile } from "@prisma/client";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return prisma.userProfile.findUnique({ where: { userId } });
}

export interface UserProfileAnalytics {
  totalViews: number;
  totalInquiries: number;
  conversionRate: number; // in percentage
  lastActive: Date | null;
  recentActivitySummary: string;
  averageResponseTimeHours?: number;
}


export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  return prisma.userProfile.update({
    where: { userId },
    data: { ...updates, updatedAt: new Date() },
  });
}

/**
 * Fetches and calculates advanced profile analytics for a given user.
 * This aggregates profile views, inquiry counts, conversion rates, last active time, and recent user activities.
 *
 * @param userId - The user ID of the pro user whose analytics are requested
 * @returns Analytics data for dashboard or reports
 */
export async function getAdvancedProfileAnalytics(userId: string): Promise<UserProfileAnalytics> {

  // Total profile views
  const totalViewsResult = await prisma.profileView.aggregate({
    where: { userId },
    _count: { _all: true },
  });
  const totalViews = totalViewsResult._count._all || 0;

  // Total inquiries received via inquiries/messages linked to the user
  const totalInquiriesResult = await prisma.inquiry.aggregate({
    where: { userId, status: { not: "rejected" } },
    _count: { _all: true },
  });
  const totalInquiries = totalInquiriesResult._count._all || 0;

  // Conversion Rate: For example, percentage of inquiries that converted into orders
  // Assuming we have orders linked to inquiries
  const convertedInquiriesResult = await prisma.order.aggregate({
    where: { userId, status: "completed" },
    _count: { _all: true },
  });
  const convertedInquiries = convertedInquiriesResult._count._all || 0;

  const conversionRate = totalInquiries === 0 ? 0 : (convertedInquiries / totalInquiries) * 100;

  // Last active timestamp (last login or last significant activity)
  const lastActiveEntry = await prisma.userActivity.findFirst({
    where: { userId },
    orderBy: { timestamp: "desc" },
    select: { timestamp: true },
  });
  const lastActive = lastActiveEntry ? lastActiveEntry.timestamp : null;

  // Recent activity summary (last 7 days)
  const recentActivities = await prisma.userActivity.findMany({
    where: {
      userId,
      timestamp: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      },
    },
    orderBy: { timestamp: "desc" },
    take: 10,
  });

  let recentActivitySummary = `${recentActivities.length} activities in last 7 days`;

  // Average response time for inquiries (optional)
  const avgResponse = await prisma.inquiry.aggregate({
    where: { userId, responseTimeMinutes: { not: null } },
    _avg: { responseTimeMinutes: true },
  });
  const averageResponseTimeHours = avgResponse._avg.responseTimeMinutes ? avgResponse._avg.responseTimeMinutes / 60 : undefined;

  return {
    totalViews,
    totalInquiries,
    conversionRate: Number(conversionRate.toFixed(2)),
    lastActive,
    recentActivitySummary,
    averageResponseTimeHours: averageResponseTimeHours ? Number(averageResponseTimeHours.toFixed(2)) : undefined,
  };
}