"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

export const metadata = {
  title: "Seller Dashboard",
  description: "Post listings, view basic analytics, and respond to inquiries",
};

export default function SellerFreePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.marketplace.getProducts({ owner: "me", limit: 5 }) // fetch seller's own products (basic)
      .then(res => {
        if (res.success && res.data) setProducts(res.data);
      })
      .catch(err => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Seller Dashboard (Free)</h1>

        {loading && <p>Loading your products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {products.length === 0 && <p>You have no listings. Post your first listing to get started!</p>}

        <ul>
          {products.map(product => (
            <li key={product.id} className="border p-4 rounded mb-2">
              <h2 className="font-semibold">{product.name}</h2>
              <p>Price: ₹{product.price}</p>
              <p>Status: {product.status}</p>
            </li>
          ))}
        </ul>
      </section>
    </RoleGuard>
  );
}
