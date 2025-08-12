"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import EarlyAccessOpportunities from "@/modules/investor/EarlyAccessOpportunities";
import DirectChatList from "@/modules/investor/DirectChatList";

export const metadata = {
  title: "Investor Pro Dashboard",
  description: "Access early investment opportunities and direct chats with sellers",
};

export default function InvestorProPage() {
  return (
    <RoleGuard allowedRoles={["investor"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Investor Pro Dashboard</h1>
        <EarlyAccessOpportunities />
        <DirectChatList />
      </div>
    </RoleGuard>
  );
}
