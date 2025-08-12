"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { LoanApplication } from "@/types/loan";

export default function OwnerLoanApplications({ limit = 5 }: { limit?: number }) {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.loans
      .getApplications({ owner: "me", limit })
      .then(res => {
        if (res.success && res.data?.loans) setLoans(res.data.loans);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Loan Applications</h3>
      {loans.length === 0 ? <p>No applications found.</p> : (
        <ul>
          {loans.map(l => (
            <li key={l.id} className="border p-4 rounded mb-2">
              Loan #{l.id} — ₹{l.amount} — Status: {l.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
