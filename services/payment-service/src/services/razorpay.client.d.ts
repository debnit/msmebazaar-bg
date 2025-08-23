declare module "razorpay" {
  interface RazorpayOrder {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
  }

  interface RazorpayOrderCreateOptions {
    amount: number;
    currency: string;
    receipt: string;
    payment_capture?: number;
    notes?: Record<string, string>;
  }

  interface RazorpayUtils {
    verifyPaymentSignature(params: {
      order_id: string;
      payment_id: string;
      signature: string;
    }): boolean;

    verifyWebhookSignature(
      body: string,
      signature: string,
      secret: string
    ): boolean;
  }

  interface Razorpay {
    orders: {
      create(options: RazorpayOrderCreateOptions): Promise<RazorpayOrder>;
    };
    utils: RazorpayUtils;
  }

  const Razorpay: {
    new (options: { key_id: string; key_secret: string }): Razorpay;
  };
  export = Razorpay;
}
