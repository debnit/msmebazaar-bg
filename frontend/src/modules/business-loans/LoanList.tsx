"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { LoanApplication } from "@/types/loan";

export default function LoanList({ owner }: { owner?: string }) {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.loans.getApplications(owner ? { owner } : undefined)
      .then(res => {
        if (res.success && res.data?.loans) setLoans(res.data.loans);
      })
      .catch(err => setError(err.message || "Failed to load loans"))
      .finally(() => setLoading(false));
  }, [owner]);

  if (loading) return <p>Loading loans...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!loans.length) return <p>No loan applications found.</p>;

  return (
    <div>
      <h3 className="font-semibold mb-2">Loan Applications</h3>
      <ul>
        {loans.map(l => (
          <li key={l.id} className="border p-3 rounded mb-2">
            #{l.id} — ₹{l.amount} — {l.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
