export interface PaymentEvent {
  eventType: string;
  paymentId: string;
  userId: string;
  timestamp: string;
  data: Record<string, any>;
}
