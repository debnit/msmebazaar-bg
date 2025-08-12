// src/app/(roles)/agent/pro/page.tsx
import RoleGuard from "@/modules/shared/RoleGuard";
import AgentDealsList from "@/modules/agent/AgentDealsList";
import AgentCrmPipeline from "@/modules/agent/AgentCrmPipeline";

export default function AgentProPage() {
  return (
    <RoleGuard allowedRoles={["agent"]} proOnly>
      <h1 className="text-2xl font-bold mb-6">Agent Pro Dashboard</h1>
      <AgentDealsList />
      <AgentCrmPipeline />
    </RoleGuard>
  );
}
