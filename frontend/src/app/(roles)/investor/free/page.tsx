"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

export default function InvestorFreePage() {
  const [opps, setOpps] = useState<Product[]>([]);

  useEffect(() => {
    api.marketplace
      .getProducts({ type: "investment", limit: 10 })
      .then(res => {
        if (res.success && res.data) setOpps(res.data);
      });
  }, []);

  return (
    <RoleGuard allowedRoles={["investor"]}>
      <h1 className="text-2xl font-bold mb-4">Investment Opportunities</h1>
      <ul>
        {opps.map(o => (
          <li key={o.id} className="border p-3 mb-2 rounded">
            {o.name} — ₹{o.price}
          </li>
        ))}
      </ul>
    </RoleGuard>
  );
}
