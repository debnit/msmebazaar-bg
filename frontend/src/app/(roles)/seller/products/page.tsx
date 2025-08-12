"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

export default function SellerProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.marketplace.getProducts({ owner: "me" })
      .then(res => {
        if (res.success && res.data) setProducts(res.data);
      })
      .catch(err => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Manage Your Products</h1>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <ul>
          {products.map(product => (
            <li key={product.id} className="border p-4 rounded mb-2">
              <h2 className="font-semibold">{product.name}</h2>
              <p>Category: {product.category}</p>
              <p>Price: ₹{product.price}</p>
              <p>Status: {product.status}</p>
              <button className="mr-2 bg-green-600 text-white px-3 py-1 rounded">Edit</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </li>
          ))}
        </ul>
      </section>
    </RoleGuard>
  );
}
