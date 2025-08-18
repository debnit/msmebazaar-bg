"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import EarlyAccessOpportunities from "@/modules/investor/EarlyAccessOpportunities";
import DirectChatList from "@/modules/investor/DirectChatList";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

import type { MatchmakingResult } from "@/types/marketplace";
import { useAuthStore } from "@/store/auth.store";

export const metadata = {
  title: "Investor Pro Dashboard",
  description: "Access early investment opportunities and direct chats with sellers",
};

export default function InvestorProPage() {
  const [matches, setMatches] = useState<MatchmakingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = useAuthStore((state) => state.user?.id);
  const [matches, setMatches] = useState([]);

  
  // Inline matchmaking check (no separate hook)
  useEffect(() => {
  if (!userId) return; // User must be logged in
  api.matchmaking.getMatchesForMsme(userId).then((res) => {
     if (res.success && res.data) setMatches(res.data);
  });
 }, [userId]);
  return (
    <RoleGuard allowedRoles={["investor"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Investor Pro Dashboard</h1>
        {/* Matched Investment Opportunities */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Matched Investment Opportunities</h2>
          {loading ? (
            <p>Loading matches...</p>
          ) : matches.length > 0 ? (
            <ul>
              {matches.map((match) => (
                <li key={match.matchedEntityId} className="mb-3 border p-3 rounded">
                  <div className="font-semibold">{match.companyName || match.matchedEntityId}</div>
                  <div>Match Score: {match.score}</div>
                  {/* More details, e.g. link to listing or documents */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No matched investment opportunities at this time.</p>
          )}
        </div>
        {/* Existing Pro features */}
        <EarlyAccessOpportunities />
        <DirectChatList />
      </div>
    </RoleGuard>
  );
}
