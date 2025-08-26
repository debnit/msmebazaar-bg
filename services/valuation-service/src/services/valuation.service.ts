import { SessionUser } from '@shared/types/user';

export class ValuationService {
  static async calculate(user: SessionUser, turnover: number) {
    // Simple placeholder valuation model: 1.5x turnover with role-based adjustments
    const base = turnover * 1.5;
    const factor = user.roles.includes('investor') ? 1.1 : user.roles.includes('msmeOwner') ? 1.0 : 0.9;
    const valuation = Math.round(base * factor);
    return { success: true, data: { valuation } };
  }
}
