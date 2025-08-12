"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

export default function EarlyAccessOpportunities() {
  const [opps, setOpps] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.marketplace
      .getProducts({ type: "investment", earlyAccess: true })
      .then(res => {
        if (res.success && res.data) setOpps(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading opportunities...</p>;
  if (opps.length === 0) return <p>No early access listings right now.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Early Access Opportunities</h3>
      <ul>
        {opps.map(op => (
          <li key={op.id} className="border p-3 rounded mb-2">
            {op.name} — ₹{op.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
