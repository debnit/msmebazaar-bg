import { apiClient } from "@mobile/api/apiClient";

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export class PaymentService {
  static async createOrder(amount: number): Promise<PaymentOrder> {
    return apiClient.post<PaymentOrder>("/payments/orders", { amount });
  }

  static async verifyPayment(paymentId: string, signature: string): Promise<boolean> {
    const result = await apiClient.post<{ verified: boolean }>("/payments/verify", {
      paymentId,
      signature,
    });
    return result.verified;
  }

  static async getTransactions() {
    return apiClient.get("/payments/transactions");
  }
}