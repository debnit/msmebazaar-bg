"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useAgentProfile, useAgentDeals, useCommissionHistory, useAgentAnalytics, useCRMDashboard } from "@/services/agent.api";
import { useState } from "react";

export default function AgentProPage() {
  const { data: profile } = useAgentProfile();
  const { data: deals } = useAgentDeals();
  const { data: commissions } = useCommissionHistory();
  const { data: analytics } = useAgentAnalytics();
  const { data: crmDashboard } = useCRMDashboard();
  const [selectedTab, setSelectedTab] = useState('deals');

  return (
    <RoleGuard allowedRoles={["agent"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-6">Agent Pro Dashboard</h1>
        
        {profile && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
            <h2 className="font-semibold text-xl mb-2">Welcome, {profile.agentName}</h2>
            <p className="text-gray-600 mb-4">Company: {profile.companyName} | License: {profile.licenseNumber}</p>
            <p className="text-gray-600 mb-4">Experience: {profile.experience} years | Location: {profile.location}</p>
            <p className="text-gray-600 mb-4">Specialization: {profile.specialization.join(', ')}</p>
            
            {analytics && (
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Deals</div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalDeals}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Completed</div>
                  <div className="text-2xl font-bold text-green-600">{analytics.completedDeals}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Commission</div>
                  <div className="text-2xl font-bold text-purple-600">₹{analytics.totalCommission?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Success Rate</div>
                  <div className="text-2xl font-bold text-orange-600">{analytics.successRate}%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['deals', 'crm', 'commissions', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Deals Tab */}
        {selectedTab === 'deals' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">All Deals (Unlimited)</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {deals?.map((deal) => (
                  <div key={deal.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{deal.buyerName} ↔ {deal.sellerName}</h3>
                        <p className="text-sm text-gray-600">Deal Type: {deal.dealType}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        deal.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        deal.status === 'AGREED' ? 'bg-blue-100 text-blue-800' :
                        deal.status === 'NEGOTIATING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deal.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div><span className="font-medium">Value:</span> ₹{deal.value.toLocaleString()}</div>
                      <div><span className="font-medium">Commission:</span> ₹{deal.commission.toLocaleString()}</div>
                      <div><span className="font-medium">Commission Rate:</span> {deal.commissionRate}%</div>
                      <div><span className="font-medium">Created:</span> {new Date(deal.createdAt).toLocaleDateString()}</div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        {deal.notes}
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          Update Status
                        </button>
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                          View Details
                        </button>
                        <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700">
                          Schedule Meeting
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM Dashboard Tab */}
        {selectedTab === 'crm' && crmDashboard && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl font-bold text-blue-600">{crmDashboard.leads}</div>
                <div className="text-sm text-gray-600">Leads</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl font-bold text-yellow-600">{crmDashboard.prospects}</div>
                <div className="text-sm text-gray-600">Prospects</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl font-bold text-green-600">{crmDashboard.wonDeals}</div>
                <div className="text-sm text-gray-600">Won Deals</div>
              </div>
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="text-3xl font-bold text-purple-600">₹{crmDashboard.pipelineValue?.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pipeline Value</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {crmDashboard.recentActivities?.map((activity) => (
                  <div key={activity.id} className="border-l-4 border-purple-500 pl-4">
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Commissions Tab */}
        {selectedTab === 'commissions' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Commission History</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {commissions?.map((commission) => (
                  <div key={commission.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Deal #{commission.dealId}</h3>
                        <p className="text-sm text-gray-600">{commission.dealType}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        commission.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        commission.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {commission.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Amount:</span> ₹{commission.amount.toLocaleString()}</div>
                      <div><span className="font-medium">Rate:</span> {commission.rate}%</div>
                      <div><span className="font-medium">Deal Value:</span> ₹{commission.dealValue.toLocaleString()}</div>
                      <div><span className="font-medium">Created:</span> {new Date(commission.createdAt).toLocaleDateString()}</div>
                    </div>
                    {commission.paidAt && (
                      <div className="text-xs text-gray-500 mt-2">
                        Paid: {new Date(commission.paidAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {selectedTab === 'analytics' && analytics && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Performance</h4>
                  <div className="space-y-2">
                    {analytics.monthlyStats?.slice(0, 6).map((stat, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{stat.month}</span>
                        <div className="text-sm">
                          <span className="text-blue-600">{stat.deals} deals</span> • 
                          <span className="text-green-600 ml-2">₹{stat.commission.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Top Performing Deals</h4>
                  <div className="space-y-2">
                    {analytics.topPerformingDeals?.slice(0, 5).map((deal) => (
                      <div key={deal.dealId} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium text-sm">Deal #{deal.dealId}</div>
                        <div className="text-xs text-gray-600">
                          ₹{deal.value.toLocaleString()} • ₹{deal.commission.toLocaleString()} commission
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pro Features Highlight */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-3">Pro Features Active</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Unlimited deals</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Higher commission rates (5%)</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Advanced analytics</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>CRM dashboard</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">✓</span>
                <span>Performance insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
