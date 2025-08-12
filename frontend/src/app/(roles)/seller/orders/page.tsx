"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Order } from "@/types/orders";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.orders.list({ seller: "me" })
      .then(res => {
        if (res.success && res.data) setOrders(res.data);
      })
      .catch(err => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Your Orders</h1>

        {loading && <p>Loading orders...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <ul>
          {orders.map(order => (
            <li key={order.id} className="border p-4 rounded mb-2">
              <p>Order ID: {order.id}</p>
              <p>Status: {order.status}</p>
              <p>Total: ₹{order.totalAmount}</p>
              <p>Placed On: {new Date(order.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      </section>
    </RoleGuard>
  );
}
