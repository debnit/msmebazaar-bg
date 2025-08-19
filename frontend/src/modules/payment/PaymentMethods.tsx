import React from "react";
import { usePaymentMethods } from "../../services/payment.api";
import { useDeletePaymentMethod, useAddPaymentMethod } from "../../hooks/useCreatePayment"; // You can create these hooks if not existing

const PaymentMethods: React.FC = () => {
  const { data, isLoading, error } = usePaymentMethods();
  const deleteMutation = useDeletePaymentMethod();
  const [newMethod, setNewMethod] = React.useState("");

  if (isLoading) return <div>Loading payment methods...</div>;
  if (error) return <div>Error loading payment methods</div>;

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // Assume add payment method UI logic here

  return (
    <div>
      <h2>Payment Methods</h2>
      <ul>
        {data?.data?.map((method) => (
          <li key={method.id}>
            {method.type} - {method.provider} {method.isDefault ? "(Default)" : ""}
            <button onClick={() => handleDelete(method.id)}>Delete</button>
          </li>
        ))}
      </ul>
      {/* Add payment method form goes here */}
    </div>
  );
};

export default PaymentMethods;
