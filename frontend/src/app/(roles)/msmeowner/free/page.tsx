"use client";
"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { msmeApi, type MsmeDto } from "@/services/msme.api";
import { api } from "@/services/api-client";
import type { LoanApplication } from "@/types/loan";

export default function MSMEOwnerFreePage() {
  const [msmes, setMsmes] = useState<MsmeDto[]>([]);
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      msmeApi.listMine(),
      api.loans.getApplications({ owner: "me", limit: 5 }),
    ])
      .then(([msmeRes, loanRes]) => {
        if (msmeRes.success && msmeRes.data) setMsmes(msmeRes.data as any);
        if (loanRes.success && loanRes.data?.loans) setLoans(loanRes.data.loans);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["msme_owner"]}>
      <h1 className="text-2xl font-bold mb-4">MSME Owner Dashboard (Free)</h1>
      {loading && <p>Loading your MSMEs and loan applications...</p>}

      <h2 className="text-xl font-semibold mt-4 mb-2">Your MSMEs</h2>
      <ul className="mb-4">
        {msmes.map((m) => (
          <li key={m.id} className="border p-4 rounded mb-2">
            <div className="font-semibold">{m.businessName}</div>
            <div className="text-sm text-gray-600">GST: {m.gstNumber}</div>
            {m.address && <div className="text-sm text-gray-600">{m.address}</div>}
          </li>
        ))}
        {msmes.length === 0 && !loading && (
          <li className="text-sm text-gray-600">No MSMEs yet. Create one from your profile.</li>
        )}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Recent Loan Applications</h2>
      <ul>
        {loans.map((loan) => (
          <li key={loan.id} className="border p-4 rounded mb-2">
            Loan #{loan.id} — ₹{loan.amount} — Status: {loan.status}
          </li>
        ))}
        {loans.length === 0 && !loading && (
          <li className="text-sm text-gray-600">No recent loan applications.</li>
        )}
      </ul>
    </RoleGuard>
  );
}
