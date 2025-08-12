"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";

interface SystemHealth {
  uptime: string;
  errorRate: number;
}

export default function SuperAdminDashboardPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);

  useEffect(() => {
    api.analytics.getDashboard({ system: true })
      .then(res => {
        if (res.success && res.data) setHealth(res.data.systemHealth);
      });
  }, []);

  return (
    <RoleGuard allowedRoles={["superadmin"]}>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      {health && (
        <p>Uptime: {health.uptime} — Errors: {health.errorRate}%</p>
      )}
    </RoleGuard>
  );
}
