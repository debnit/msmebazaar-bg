"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface Deal {
  id: string;
  buyerName: string;
  sellerName: string;
  status: string;
  commissionEarned: number;
}

export default function AgentFreePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.deals
      .list({ limit: 5 }) // limited deals for free agents
      .then(res => {
        if (res.success && res.data) {
          setDeals(res.data);
        }
      })
      .catch(err => setError(err.message || "Failed to fetch deals"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["agent"]}>
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard (Free)</h1>
      {loading && <p>Loading deals...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {deals.map(d => (
          <li key={d.id} className="border p-4 rounded mb-2">
            {d.buyerName} ↔ {d.sellerName} — Status: {d.status} — Commission ₹{d.commissionEarned}
          </li>
        ))}
      </ul>
    </RoleGuard>
  );
}
