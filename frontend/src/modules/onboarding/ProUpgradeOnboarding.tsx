"use client";

import React, { useState } from "react";
import PaymentCheckout from "@/modules/payment/PaymentCheckout";

export default function ProUpgradeOnboarding() {
  const [isReadyToPay, setIsReadyToPay] = useState(false);
  const [loading, setLoading] = useState(false);

  // Example amount for PRO upgrade; replace with actual pricing logic or props
  const upgradeAmount = 99;

  // Trigger payment step display
  const startUpgradePayment = () => {
    setIsReadyToPay(true);
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Upgrade to MSMEBazaar Pro</h3>

      {!isReadyToPay ? (
        <button
          onClick={startUpgradePayment}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Preparing payment..." : "Upgrade Now for ₹99"}
        </button>
      ) : (
        <PaymentCheckout amount={upgradeAmount} />
      )}
    </div>
  );
}
