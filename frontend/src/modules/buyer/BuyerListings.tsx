"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

interface Props {
  limit?: number;
  advancedSearch?: boolean;
  query?: string;
}

export default function BuyerListings({ limit = 10, advancedSearch, query }: Props) {
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    try {
      const res = advancedSearch
        ? await api.marketplace.searchProducts(query || "", { limit })
        : await api.marketplace.getProducts({ limit });
        
      if (res.success && res.data) setListings(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, [query, limit]);

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <ul>
      {listings.map(l => (
        <li key={l.id} className="border p-4 mb-2 rounded">
          <h3 className="font-semibold">{l.name}</h3>
          <p>{l.description}</p>
          <p className="text-sm text-gray-500">₹{l.price}</p>
        </li>
      ))}
    </ul>
  );
}
