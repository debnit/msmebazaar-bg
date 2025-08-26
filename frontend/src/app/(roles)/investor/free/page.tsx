"use client";
import RoleGuard from "@/modules/shared/RoleGuard";
import { useInvestorProfile, useBrowseOpportunities, useInvestmentHistory, useInvestorAnalytics } from "@/services/investor.api";
import { FEATURE_ROUTES } from "@/utils/routes";

export default function InvestorFreePage() {
  const { data: profile } = useInvestorProfile();
  const { data: opportunities, isLoading, error } = useBrowseOpportunities();
  const { data: investments } = useInvestmentHistory();
  const { data: analytics } = useInvestorAnalytics();

  return (
    <RoleGuard allowedRoles={["investor"]}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold mb-4">Investment Opportunities</h1>
        
        {profile && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h2 className="font-semibold text-lg">Welcome, {profile.investorName}</h2>
            <p className="text-sm text-gray-600">Investment Focus: {profile.investmentFocus.join(', ')}</p>
            <p className="text-sm text-gray-600">Range: ₹{profile.investmentRange.min.toLocaleString()} - ₹{profile.investmentRange.max.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Experience: {profile.experience} years | Total Investments: {profile.totalInvestments}</p>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalOpportunities}</div>
              <div className="text-sm text-gray-600">Total Opportunities</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{analytics.investedOpportunities}</div>
              <div className="text-sm text-gray-600">Invested</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">₹{analytics.totalAmountInvested?.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Invested</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-orange-600">{analytics.averageReturn}%</div>
              <div className="text-sm text-gray-600">Avg Return</div>
            </div>
          </div>
        )}

        {isLoading && <p>Loading opportunities...</p>}
        {error && <p className="text-red-600">Failed to load opportunities</p>}

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Available Investment Opportunities</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {opportunities?.slice(0, 10).map((opportunity) => (
                <div key={opportunity.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{opportunity.msmeName}</h3>
                      <p className="text-sm text-gray-600">{opportunity.businessType} • {opportunity.industry}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      opportunity.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                      opportunity.status === 'CLOSED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {opportunity.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{opportunity.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div><span className="font-medium">Investment Amount:</span> ₹{opportunity.investmentAmount.toLocaleString()}</div>
                    <div><span className="font-medium">Equity Offered:</span> {opportunity.equityOffered}%</div>
                    <div><span className="font-medium">Valuation:</span> ₹{opportunity.valuation.toLocaleString()}</div>
                    <div><span className="font-medium">Location:</span> {opportunity.location}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <h4 className="font-medium text-sm mb-2">Financial Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Revenue: ₹{opportunity.financialMetrics.annualRevenue.toLocaleString()}</div>
                      <div>Profit Margin: {opportunity.financialMetrics.profitMargin}%</div>
                      <div>Growth Rate: {opportunity.financialMetrics.growthRate}%</div>
                      <div>Debt/Equity: {opportunity.financialMetrics.debtToEquity}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Expires: {new Date(opportunity.expiresAt).toLocaleDateString()}
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                      Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {investments && investments.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Recent Investments</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {investments.slice(0, 5).map((investment) => (
                  <div key={investment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium">Opportunity #{investment.opportunityId}</div>
                      <div className="text-sm text-gray-600">Amount: ₹{investment.amount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{investment.equityPercentage}% equity</div>
                      <div className="text-sm text-gray-600">{investment.status}</div>
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
            <li>• Limited to 10 opportunities per month</li>
            <li>• No early access to opportunities</li>
            <li>• Basic analytics only</li>
            <li>• No direct communication with sellers</li>
          </ul>
          <p className="mt-3">
            Want more features? Upgrade to <a href={FEATURE_ROUTES.businessLoans.path} className="text-blue-600 underline font-medium">Pro</a> for early access,
            unlimited opportunities, and direct seller communication.
          </p>
        </div>
      </div>
    </RoleGuard>
  );
}
