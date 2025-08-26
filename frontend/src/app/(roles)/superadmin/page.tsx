"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useSuperAdminDashboard, useSystemWideAnalytics, useSystemHealthOverview, useAuditLogs } from "@/services/superadmin.api";
import { useState } from "react";

export default function SuperAdminDashboardPage() {
  const { data: dashboard } = useSuperAdminDashboard();
  const { data: analytics } = useSystemWideAnalytics();
  const { data: systemHealth } = useSystemHealthOverview();
  const { data: auditLogs } = useAuditLogs(1, 10);
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <RoleGuard allowedRoles={["superadmin"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'analytics', 'system', 'audit'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && dashboard && (
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{dashboard.totalUsers}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-green-600">{dashboard.activeUsers}</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{dashboard.proUsers}</div>
              <div className="text-sm text-gray-600">Pro Users</div>
            </div>
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="text-3xl font-bold text-orange-600">₹{dashboard.todayRevenue?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Today's Revenue</div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{analytics.totalUsers}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-green-600">{analytics.proUsers}</div>
                <div className="text-sm text-gray-600">Pro Users</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-purple-600">₹{analytics.totalRevenue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-2xl font-bold text-orange-600">{analytics.systemUptime}%</div>
                <div className="text-sm text-gray-600">System Uptime</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">System Metrics</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{analytics.systemMetrics?.cpuUsage}%</div>
                  <div className="text-sm text-gray-600">CPU Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{analytics.systemMetrics?.memoryUsage}%</div>
                  <div className="text-sm text-gray-600">Memory Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{analytics.systemMetrics?.diskUsage}%</div>
                  <div className="text-sm text-gray-600">Disk Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{analytics.systemMetrics?.networkTraffic}MB/s</div>
                  <div className="text-sm text-gray-600">Network Traffic</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
              <div className="grid grid-cols-7 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{analytics.userDistribution?.buyers}</div>
                  <div className="text-gray-600">Buyers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{analytics.userDistribution?.sellers}</div>
                  <div className="text-gray-600">Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{analytics.userDistribution?.agents}</div>
                  <div className="text-gray-600">Agents</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">{analytics.userDistribution?.investors}</div>
                  <div className="text-gray-600">Investors</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{analytics.userDistribution?.msmeOwners}</div>
                  <div className="text-gray-600">MSME Owners</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-indigo-600">{analytics.userDistribution?.admins}</div>
                  <div className="text-gray-600">Admins</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-pink-600">{analytics.userDistribution?.superAdmins}</div>
                  <div className="text-gray-600">Super Admins</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {selectedTab === 'system' && systemHealth && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">System Health Overview</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  systemHealth.overallStatus === 'HEALTHY' ? 'bg-green-100 text-green-800' :
                  systemHealth.overallStatus === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {systemHealth.overallStatus}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Services</h4>
                  <div className="space-y-2">
                    {systemHealth.services?.map((service) => (
                      <div key={service.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{service.name}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          service.status === 'HEALTHY' ? 'bg-green-100 text-green-800' :
                          service.status === 'DEGRADED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Infrastructure</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <span className="text-sm text-gray-600">{systemHealth.infrastructure?.database.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cache</span>
                      <span className="text-sm text-gray-600">{systemHealth.infrastructure?.cache.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Load Balancer</span>
                      <span className="text-sm text-gray-600">{systemHealth.infrastructure?.loadBalancer.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage</span>
                      <span className="text-sm text-gray-600">{systemHealth.infrastructure?.storage.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {selectedTab === 'audit' && auditLogs && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Audit Logs</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {auditLogs.auditLogs?.map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600">{log.resource}: {log.resourceId}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.ipAddress}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
