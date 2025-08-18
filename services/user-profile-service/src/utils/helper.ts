// services/user-profile-service/src/utils/helpers.ts

/**
 * Remove undefined/null fields from a user profile update payload.
 */
export function cleanProfileUpdates<T extends Record<string, any>>(updates: T): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && value !== null && value !== "") {
      result[key as keyof T] = value;
    }
  }
  return result;
}

/**
 * Safely extract user id from Express request (typed)
 */
export function getUserIdFromReq(req: any): string {
  // Support for both custom and passport/jwt approach
  return req.user?.id || req.userId || req?.session?.userId || "";
}

/**
 * Format dates to ISO string (optional for audit logs)
 */
export function toISODateString(date: Date | string | undefined) {
  if (!date) return undefined;
  return new Date(date).toISOString();
}
