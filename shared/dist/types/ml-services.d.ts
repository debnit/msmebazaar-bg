/** ==== Recommendation Service ==== */
export interface RecommendationRequest {
    userId: string;
    limit?: number;
    filters?: Record<string, any>;
}
export interface RecommendationItem {
    id: string;
    title: string;
    score: number;
    metadata?: Record<string, any>;
}
export interface RecommendationResponse {
    success: boolean;
    recommendations: RecommendationItem[];
}
/** ==== Valuation Service ==== */
export interface ValuationRequest {
    businessId: string;
    metrics: {
        turnover: number;
        profitMargin: number;
        growthRate?: number;
        industry?: string;
        [key: string]: number | string | undefined;
    };
}
export interface ValuationResult {
    valuation: number;
    confidence: number;
    breakdown?: Record<string, number>;
}
export interface ValuationResponse {
    success: boolean;
    result: ValuationResult;
}
//# sourceMappingURL=ml-services.d.ts.map