"use strict";
// services/payment-service/src/utils/helpers.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromReq = getUserIdFromReq;
exports.cleanPaymentData = cleanPaymentData;
exports.formatCurrencyAmount = formatCurrencyAmount;
/**
 * Extract User ID safely from Express request for auth context
 */
function getUserIdFromReq(req) {
    // Adapt based on your auth strategy
    return req.user?.id || req.session?.userId || '';
}
/**
 * Sanitize payment input data by removing null/undefined fields
 */
function cleanPaymentData(data) {
    return Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key] = value;
        }
        return acc;
    }, {});
}
/**
 * Format currency values to fixed decimals (2 decimals)
 */
function formatCurrencyAmount(amount) {
    return amount.toFixed(2);
}
//# sourceMappingURL=helper.js.map