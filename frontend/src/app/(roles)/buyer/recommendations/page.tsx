// src/app/(roles)/buyer/recommendations/page.tsx
"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Recommendation } from "@/types/recommendation";

export default function BuyerRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.analytics
      .getDashboard()
      .then((res) => {
        // Ideally, you fetch recommendations endpoint, using dummy for now
        if (res.success && res.data) {
          setRecommendations(res.data.recommendations || []);
        }
      })
      .catch(() => setError("Failed to load recommendations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <RoleGuard allowedRoles={["buyer"]}>
      <section className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Your Recommendations</h1>

        {loading && <p>Loading recommendations...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {recommendations.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          <ul>
            {recommendations.map((rec) => (
              <li key={rec.id} className="mb-2 border p-3 rounded">
                <h2 className="font-semibold">{rec.title}</h2>
                <p>{rec.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </RoleGuard>
  );
}
