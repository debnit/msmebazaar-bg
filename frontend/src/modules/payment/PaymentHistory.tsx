import React from "react";
import { usePaymentHistory } from "../../services/payment.api";
import { RoleGuard } from "../shared/RoleGuard";

const PaymentHistory: React.FC = () => {
  const { data, error, isLoading } = usePaymentHistory();

  if (isLoading) return <div>Loading payment history...</div>;
  if (error) return <div>Error loading payment history</div>;

  return (
    <RoleGuard roles={["buyer", "seller", "msmeowner", "investor", "agent"]} proRequired={true}>
      <div>
        <h2>Payment History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.amount} {payment.currency}</td>
                <td>{payment.status}</td>
                <td>{payment.paymentMethod?.type || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RoleGuard>
  );
};

export default PaymentHistory;
