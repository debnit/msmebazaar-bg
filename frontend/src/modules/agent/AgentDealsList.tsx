"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface Deal {
  id: string;
  buyerName: string;
  sellerName: string;
  status: string;
  commissionEarned: number;
}

export default function AgentDealsList({ limit = 10 }: { limit?: number }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.deals
      .list({ limit })
      .then(res => {
        if (res.success && res.data) setDeals(res.data);
      })
      .catch(err => setError(err.message || "Failed to load deals"))
      .finally(() => setLoading(false));
  }, [limit]);

  if (loading) return <p>Loading deals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Recent Deals</h3>
      {deals.length === 0 ? (
        <p>No deals found.</p>
      ) : (
        <ul>
          {deals.map(d => (
            <li key={d.id} className="border p-4 rounded mb-2">
              {d.buyerName} ↔ {d.sellerName} — {d.status} — ₹{d.commissionEarned}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
