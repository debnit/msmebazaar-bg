"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useDashboardSummary, useUserManagement, useBasicAnalytics, useFeatureFlags, useSystemHealth } from "@/services/admin.api";
import { useState } from "react";

export default function AdminDashboardPage() {
  const { data: dashboard } = useDashboardSummary();
  const { data: users } = useUserManagement(1, 20);
  const { data: analytics } = useBasicAnalytics();
  const { data: featureFlags } = useFeatureFlags();
  const { data: systemHealth } = useSystemHealth();
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['dashboard', 'users', 'analytics', 'features', 'system'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {selectedTab === 'dashboard' && dashboard && (
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
              <div className="text-3xl font-bold text-orange-600">{dashboard.todaySignups}</div>
              <div className="text-sm text-gray-600">Today's Signups</div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {selectedTab === 'users' && users && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roles</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.users?.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.roles.join(', ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          user.status === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
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
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
              <div className="grid grid-cols-5 gap-4 text-sm">
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
              </div>
            </div>
          </div>
        )}

        {/* Features Tab */}
        {selectedTab === 'features' && featureFlags && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Feature Flags</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {featureFlags.map((flag) => (
                  <div key={flag.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{flag.name}</h3>
                      <p className="text-sm text-gray-600">{flag.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        flag.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      {flag.proOnly && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          Pro Only
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {selectedTab === 'system' && systemHealth && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">System Health</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Database:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    systemHealth.database.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemHealth.database.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Cache:</span>
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    systemHealth.cache.status === 'healthy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {systemHealth.cache.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
