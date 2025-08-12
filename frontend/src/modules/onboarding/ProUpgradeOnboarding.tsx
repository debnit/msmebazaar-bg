"use client";
import { useState } from "react";
import { api } from "@/services/api-client";

export default function ProUpgradeOnboarding() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    const res = await api.payments.createOrder({ plan: "pro_upgrade" });
    setLoading(false);
    if (res.success) {
      window.location.href = res.data.paymentUrl;
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Upgrade to Pro</h3>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Upgrade Now"}
      </button>
    </div>
  );
}
