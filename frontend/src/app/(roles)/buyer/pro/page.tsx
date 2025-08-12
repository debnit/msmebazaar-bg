"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import BuyerListings from "@/modules/buyer/BuyerListings";
import BuyerRecommendations from "@/modules/buyer/BuyerRecommendations";

export const metadata = {
  title: "Buyer Pro Dashboard",
  description: "Pro-level buyer dashboard with advanced search and insights",
};

export default function BuyerProPage() {
  return (
    <RoleGuard allowedRoles={["buyer"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Buyer Pro Dashboard</h1>
        <BuyerListings limit={50} advancedSearch />
        <BuyerRecommendations />
      </div>
    </RoleGuard>
  );
}
