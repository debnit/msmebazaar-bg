"use client";

import { useState, useEffect } from "react";
import { api } from "@/services/api-client";
import type { Product } from "@/types/marketplace";

interface BuyerProFeaturesProps {
  /** Initial search query for advanced search */
  initialQuery?: string;
  /** Max results to request */
  limit?: number;
}

export default function BuyerProFeatures({
  initialQuery = "",
  limit = 20,
}: BuyerProFeaturesProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [error, setError] = useState<string | null>(null);
  const [prioritySupportContact, setPrioritySupportContact] = useState<string | null>(null);

  // Load initial products on mount
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.marketplace.searchProducts(query, {
        limit,
        advancedFilters: true, // backend flag for advanced pro filter
      });
      if (res.success && res.data) {
        setProducts(res.data);
      } else {
        setError(res.message || "Failed to fetch products");
      }
    } catch (err: any) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const sendUnlimitedMessage = async (sellerId: string) => {
    try {
      // Example: Placeholder messaging API call
      const res = await api.messaging.sendMessage(
        `seller-${sellerId}`,
        "Hello, I am interested in your listing."
      );
      if (res.success) {
        alert("Message sent successfully!");
      }
    } catch (err: any) {
      alert(err.message || "Failed to send message");
    }
  };

  const fetchPrioritySupport = async () => {
    try {
      // Example: Imagine API returns support ticket/contact for pro user
      const res = await api.user.getProfile();
      if (res.success && res.data?.prioritySupportContact) {
        setPrioritySupportContact(res.data.prioritySupportContact);
      } else {
        setPrioritySupportContact("support@msmebazaar.com");
      }
    } catch {
      setPrioritySupportContact("support@msmebazaar.com");
    }
  };

  useEffect(() => {
    fetchPrioritySupport();
  }, []);

  return (
    <div className="space-y-6 border rounded-lg p-5 bg-white shadow">
      <h2 className="text-xl font-bold">Pro-Only Features</h2>

      {/* Advanced Search */}
      <div className="space-y-2">
        <h3 className="font-semibold">Advanced Search</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search with advanced filters..."
            className="border px-3 py-2 flex-1 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
          />
          <button
            onClick={() => handleSearch(searchTerm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {!loading && products.length > 0 && (
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map((p) => (
              <li key={p.id} className="border p-3 rounded shadow-sm">
                <h4 className="font-semibold">{p.name}</h4>
                <p className="text-sm text-gray-600">{p.description}</p>
                <p className="text-sm font-medium">₹{p.price}</p>
                <button
                  onClick={() => sendUnlimitedMessage(p.ownerId || "")}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Message Seller (Unlimited)
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Priority Support */}
      <div>
        <h3 className="font-semibold">Priority Support</h3>
        {prioritySupportContact ? (
          <p>
            Contact our Pro Support directly at:{" "}
            <a
              href={`mailto:${prioritySupportContact}`}
              className="text-blue-600 underline"
            >
              {prioritySupportContact}
            </a>
          </p>
        ) : (
          <p>Loading priority support contact...</p>
        )}
      </div>
    </div>
  );
}
