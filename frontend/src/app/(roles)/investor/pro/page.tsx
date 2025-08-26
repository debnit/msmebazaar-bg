"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useInvestorProfile, useBrowseOpportunities, useEarlyAccessOpportunities, useDirectChats, useInvestorAnalytics, useInvestmentHistory } from "@/services/investor.api";
import { useState } from "react";

export default function InvestorProPage() {
  const { data: profile } = useInvestorProfile();
  const { data: opportunities } = useBrowseOpportunities();
  const { data: earlyAccessOpportunities } = useEarlyAccessOpportunities();
  const { data: directChats } = useDirectChats();
  const { data: analytics } = useInvestorAnalytics();
  const { data: investments } = useInvestmentHistory();
  const [selectedTab, setSelectedTab] = useState('opportunities');

  return (
    <RoleGuard allowedRoles={["investor"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Investor Pro Dashboard</h1>
        
        {profile && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border">
            <h2 className="font-semibold text-xl mb-2">Welcome, {profile.investorName}</h2>
            <p className="text-gray-600 mb-4">Investment Focus: {profile.investmentFocus.join(', ')}</p>
            <p className="text-gray-600 mb-4">Range: ₹{profile.investmentRange.min.toLocaleString()} - ₹{profile.investmentRange.max.toLocaleString()}</p>
            <p className="text-gray-600 mb-4">Experience: {profile.experience} years | Total Investments: {profile.totalInvestments}</p>
            
            {analytics && (
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Opportunities</div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalOpportunities}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Invested</div>
                  <div className="text-2xl font-bold text-green-600">{analytics.investedOpportunities}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Invested</div>
                  <div className="text-2xl font-bold text-purple-600">₹{analytics.totalAmountInvested?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Avg Return</div>
                  <div className="text-2xl font-bold text-orange-600">{analytics.averageReturn}%</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['opportunities', 'early-access', 'chats', 'portfolio', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Opportunities Tab */}
        {selectedTab === 'opportunities' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">All Investment Opportunities</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {opportunities?.map((opportunity) => (
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
                      <div className="flex space-x-2">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                          Express Interest
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                          Direct Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Early Access Tab */}
        {selectedTab === 'early-access' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Early Access Opportunities (Pro Exclusive)</h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {earlyAccessOpportunities?.map((opportunity) => (
                  <div key={opportunity.id} className="border p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{opportunity.msmeName}</h3>
                        <p className="text-sm text-gray-600">{opportunity.businessType} • {opportunity.industry}</p>
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mt-1">
                          Early Access
                        </span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        opportunity.status === 'OPEN' ? 'bg-green-100 text-green-800' :
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
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        Early Access until: {new Date(opportunity.expiresAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors">
                          Priority Interest
                        </button>
                        <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors">
                          Direct Chat
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Direct Chats Tab */}
        {selectedTab === 'chats' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Direct Communication (Pro Feature)</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {directChats?.map((chat) => (
                  <div key={chat.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{chat.msmeName}</h3>
                        <p className="text-sm text-gray-600">{chat.lastMessage}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{new Date(chat.lastMessageAt).toLocaleDateString()}</div>
                        {chat.unreadCount > 0 && (
                          <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mt-1">
                            {chat.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        chat.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {chat.status}
                      </span>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Open Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {selectedTab === 'portfolio' && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Investment Portfolio</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {investments?.map((investment) => (
                  <div key={investment.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Opportunity #{investment.opportunityId}</h3>
                        <p className="text-sm text-gray-600">{investment.notes}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        investment.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        investment.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                        investment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {investment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium">Amount:</span> ₹{investment.amount.toLocaleString()}</div>
                      <div><span className="font-medium">Equity:</span> {investment.equityPercentage}%</div>
                      <div><span className="font-medium">Created:</span> {new Date(investment.createdAt).toLocaleDateString()}</div>
                      {investment.completedAt && (
                        <div><span className="font-medium">Completed:</span> {new Date(investment.completedAt).toLocaleDateString()}</div>
                      )}
                    </div>
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
              <h3 className="text-lg font-semibold mb-4">Investment Performance</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Monthly Performance</h4>
                  <div className="space-y-2">
                    {analytics.investmentHistory?.slice(0, 6).map((stat, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{stat.month}</span>
                        <div className="text-sm">
                          <span className="text-blue-600">{stat.investments} investments</span> • 
                          <span className="text-green-600 ml-2">₹{stat.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Top Performers</h4>
                  <div className="space-y-2">
                    {analytics.topPerformers?.slice(0, 5).map((performer) => (
                      <div key={performer.opportunityId} className="p-2 bg-gray-50 rounded">
                        <div className="font-medium text-sm">{performer.msmeName}</div>
                        <div className="text-xs text-gray-600">
                          {performer.return}% return • ₹{performer.amount.toLocaleString()}
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
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
          <h3 className="font-semibold text-indigo-800 mb-3">Pro Features Active</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Early access to opportunities</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Direct seller communication</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Advanced analytics</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Unlimited opportunities</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Portfolio insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
