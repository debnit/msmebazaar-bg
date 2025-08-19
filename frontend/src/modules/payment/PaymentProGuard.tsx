import React from "react";
import { usePro } from "../../hooks/use-Pro";
import { useFeatureAccess } from "../../hooks/use-Feature-Access";

interface PaymentProGuardProps {
  children: React.ReactNode;
}

const PaymentProGuard: React.FC<PaymentProGuardProps> = ({ children }) => {
  const { isPro } = usePro();
  const { hasAccess, isLoading } = useFeatureAccess("paymentservice", "payments"); // Example keys

  if (isLoading) return <div>Checking access...</div>;

  if (!isPro || !hasAccess) {
    return (
      <div>
        <h3>Upgrade to PRO to access payment features</h3>
        {/* Insert upgrade modal / CTA button here */}
      </div>
    );
  }

  return <>{children}</>;
};

export default PaymentProGuard;
