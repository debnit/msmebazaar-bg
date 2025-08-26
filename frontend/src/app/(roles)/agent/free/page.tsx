"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useAgentProfile, useAgentDeals, useCommissionHistory, useBasicAnalytics } from "@/services/agent.api";
import { FEATURE_ROUTES } from "@/utils/routes";

export default function AgentFreePage() {
  const { data: profile } = useAgentProfile();
  const { data: deals, isLoading, error } = useAgentDeals();
  const { data: commissions } = useCommissionHistory();
  const { data: analytics } = useBasicAnalytics();

  return (
    <RoleGuard allowedRoles={["agent"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Agent Dashboard (Free)</h1>
        
        {profile && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h2 className="font-semibold text-lg">Welcome, {profile.agentName}</h2>
            <p className="text-sm text-gray-600">Company: {profile.companyName} | License: {profile.licenseNumber}</p>
            <p className="text-sm text-gray-600">Experience: {profile.experience} years | Location: {profile.location}</p>
            <p className="text-sm text-gray-600">Specialization: {profile.specialization.join(', ')}</p>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalDeals}</div>
              <div className="text-sm text-gray-600">Total Deals</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{analytics.completedDeals}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">₹{analytics.totalCommission?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Commission</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{analytics.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        )}

        {isLoading && <p>Loading deals...</p>}
        {error && <p className="text-red-500">Failed to fetch deals</p>}

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Deals (Limited to 5)</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {deals?.slice(0, 5).map((deal) => (
                <div key={deal.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{deal.buyerName} ↔ {deal.sellerName}</h3>
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
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Value:</span> ₹{deal.value.toLocaleString()}</div>
                    <div><span className="font-medium">Commission:</span> ₹{deal.commission.toLocaleString()}</div>
                    <div><span className="font-medium">Commission Rate:</span> {deal.commissionRate}%</div>
                    <div><span className="font-medium">Created:</span> {new Date(deal.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {commissions && commissions.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Commissions</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {commissions.slice(0, 3).map((commission) => (
                  <div key={commission.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Deal #{commission.dealId}</div>
                      <div className="text-sm text-gray-600">{commission.dealType}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{commission.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{commission.rate}% rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Free Plan Limitations</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Limited to 5 active deals</li>
            <li>• Basic commission rates (2%)</li>
            <li>• Basic analytics only</li>
            <li>• No CRM dashboard</li>
          </ul>
          <p className="mt-3">
            Want more features? Upgrade to <a href={FEATURE_ROUTES.businessLoans.path} className="text-blue-600 underline font-medium">Pro</a> for unlimited deals,
            higher commission rates, and advanced CRM tools.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
