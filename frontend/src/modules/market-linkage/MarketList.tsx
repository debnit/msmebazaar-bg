"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface Market {
  id: string;
  name: string;
  category: string;
}

export default function MarketList() {
  const [markets, setMarkets] = useState<Market[]>([]);

  useEffect(() => {
    api.marketLinkage?.getMarkets?.().then(res => {
      if (res?.success && res.data) setMarkets(res.data);
    });
  }, []);

  return (
    <ul>
      {markets.map(m => (
        <li key={m.id}>
          {m.name} — {m.category}
        </li>
      ))}
    </ul>
  );
}
