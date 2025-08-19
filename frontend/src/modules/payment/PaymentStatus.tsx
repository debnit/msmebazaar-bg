import React from "react";
import { usePaymentStatus } from "../../services/payment.api";

interface PaymentStatusProps {
  paymentId: string;
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentId }) => {
  const { data, error, isLoading } = usePaymentStatus(paymentId);

  if (isLoading) return <div>Checking payment status...</div>;
  if (error) return <div>Error fetching payment status</div>;

  return (
    <div>
      <h2>Payment Status</h2>
      <p>Status: {data?.data?.status ?? "Unknown"}</p>
      {data?.data?.failureReason && <p>Failure Reason: {data.data.failureReason}</p>}
    </div>
  );
};

export default PaymentStatus;
