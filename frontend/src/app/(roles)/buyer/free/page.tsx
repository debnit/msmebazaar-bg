// src/app/(roles)/buyer/free/page.tsx
"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Listing } from "@/types/marketplace";
import { FEATURE_ROUTES } from "@/utils/routes";

export const metadata = {
  title: "Buyer Dashboard",
  description: "Browse listings, search MSMEs and contact sellers",
};

export default function BuyerFreePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.marketplace
      .getProducts({ limit: 10 }) // example param for paginated listing
      .then((res) => {
        if (res.success && res.data) {
          setListings(res.data);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load listings");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["buyer"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Buyer Dashboard (Free)</h1>

        {loading && <p>Loading listings...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <ul>
          {listings.map((listing) => (
            <li key={listing.id} className="border p-4 rounded mb-2">
              <h2 className="font-semibold">{listing.title}</h2>
              <p>{listing.description}</p>
              <p className="text-sm text-gray-600">Price: ₹{listing.price}</p>
              <button
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => alert("Contact Seller clicked")}
              >
                Contact Seller (Limited)
              </button>
            </li>
          ))}
        </ul>

        <p>
          Want more features? Upgrade to <a href={FEATURE_ROUTES.BUSINESS_LOANS.path} className="text-blue-600 underline">Pro</a> for advanced search,
          unlimited messaging and priority support.
        </p>
      </section>
    </RoleGuard>
  );
}
