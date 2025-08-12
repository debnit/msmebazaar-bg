"use client";

import { useState } from "react";
import { useLoanStatus } from "@/hooks/useLoanStatus";

export default function LoanStatusPage() {
  const [loanId, setLoanId] = useState("");
  const { loanData, loading, error, fetchStatus } = useLoanStatus();

  const onCheckStatus = () => {
    if (loanId.trim()) {
      fetchStatus(loanId.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-xl font-semibold mb-4">Check Your Loan Status</h1>
      <input
        type="text"
        value={loanId}
        onChange={(e) => setLoanId(e.target.value)}
        placeholder="Enter your Loan ID"
        className="w-full border rounded px-3 py-2 mb-4"
      />
      <button
        onClick={onCheckStatus}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Status"}
      </button>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {loanData && !error && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <p><strong>Status:</strong> {loanData.status}</p>
          <p><strong>Stage:</strong> {loanData.stage}</p>
          <p><strong>Amount:</strong> ₹{loanData.amount.toLocaleString()}</p>
          {/* Add more loan info here as needed */}
        </div>
      )}
    </div>
  );
}
