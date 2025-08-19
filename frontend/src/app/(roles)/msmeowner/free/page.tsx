"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { LoanApplication } from "@/types/loan";

export default function MSMEOwnerFreePage() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.loans
      .getApplications({ owner: "me", limit: 5 })
      .then(res => {
        if (res.success && res.data?.loans) setLoans(res.data.loans);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["msme_owner"]}>
      <h1 className="text-2xl font-bold mb-4">MSME Owner Dashboard (Free)</h1>
      {loading && <p>Loading your loan applications...</p>}
      <ul>
        {loans.map(loan => (
          <li key={loan.id} className="border p-4 rounded mb-2">
            Loan #{loan.id} — ₹{loan.amount} — Status: {loan.status}
          </li>
        ))}
      </ul>
    </RoleGuard>
  );
}
