// services/payment-service/src/utils/helpers.ts

/**
 * Extract User ID safely from Express request for auth context
 */
export function getUserIdFromReq(req: any): string {
  // Adapt based on your auth strategy
  return req.user?.id || req.session?.userId || '';
}

/**
 * Sanitize payment input data by removing null/undefined fields
 */
export function cleanPaymentData(data: Record<string, any>): Record<string, any> {
  return Object.entries(data).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Format currency values to fixed decimals (2 decimals)
 */
export function formatCurrencyAmount(amount: number): string {
  return amount.toFixed(2);
}
