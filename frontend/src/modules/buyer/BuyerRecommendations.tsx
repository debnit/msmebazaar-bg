"use client";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { Recommendation } from "@/types/marketplace";

export default function BuyerRecommendations() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.getDashboard({ section: "buyer_recommendations" })
      .then(res => {
        if (res.success && res.data?.recommendations) {
          setRecs(res.data.recommendations);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
  api.recommendation.getListings({ role: "buyer", userId: currentUserId })
    .then(res => {
      if (res.success && res.data?.items) {
        setRecs(res.data.items);
      }
    })
    .finally(() => setLoading(false));
}, []);


  if (loading) return <p>Loading recommendations...</p>;
  if (!recs.length) return <p>No recommendations available.</p>;

  return (
    <ul>
      {recs.map(r => (
        <li key={r.id} className="border p-3 rounded mb-2">
          <h4 className="font-semibold">{r.title}</h4>
          <p>{r.description}</p>
        </li>
      ))}
    </ul>
  );
}
