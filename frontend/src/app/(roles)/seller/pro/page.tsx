"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import SellerProductsTable from "@/modules/seller/SellerProductsTable";
import SellerAnalytics from "@/modules/seller/SellerAnalytics";

export const metadata = {
  title: "Seller Pro Dashboard",
  description: "Manage multiple listings and access advanced analytics",
};

export default function SellerProPage() {
  return (
    <RoleGuard allowedRoles={["seller"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Seller Pro Dashboard</h1>
        <SellerProductsTable />
        <SellerAnalytics />
      </div>
    </RoleGuard>
  );
}
