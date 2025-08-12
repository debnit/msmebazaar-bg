"use client";
import { useState } from "react";
import { api } from "@/services/api-client";

export default function ValuationTools() {
  const [turnover, setTurnover] = useState<number>(0);
  const [valuation, setValuation] = useState<number | null>(null);

  const calculateValuation = async () => {
    // Example API integration placeholder:
    const factor = 1.5;
    setValuation(turnover * factor);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Business Valuation Tool</h3>
      <input
        type="number"
        className="border px-3 py-2 rounded"
        placeholder="Annual turnover"
        value={turnover}
        onChange={(e) => setTurnover(Number(e.target.value))}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={calculateValuation}
      >
        Calculate
      </button>
      {valuation !== null && (
        <p className="font-medium">Estimated Valuation: ₹{valuation}</p>
      )}
    </div>
  );
}
