"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { api } from "@/services/api-client";
import type { ApiResponse } from "@/services/api-client";

interface UserSummary {
  totalUsers: number;
  activeUsers: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<UserSummary | null>(null);

  useEffect(() => {
    api.analytics
      .getDashboard()
      .then(res => {
        if (res.success && res.data) {
          setStats(res.data.users);
        }
      });
  }, []);

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {stats && (
        <p>Total: {stats.totalUsers} — Active: {stats.activeUsers}</p>
      )}
    </RoleGuard>
  );
}
