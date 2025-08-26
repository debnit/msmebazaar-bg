"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useSellerProfile, useSellerListings, useInquiries, useSellerAnalytics } from "@/services/seller.api";
import { useState } from "react";

export default function SellerProPage() {
  const { data: profile } = useSellerProfile();
  const { data: listings } = useSellerListings();
  const { data: inquiries } = useInquiries();
  const { data: analytics } = useSellerAnalytics();
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  return (
    <RoleGuard allowedRoles={["seller"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Seller Pro Dashboard</h1>
        
        {profile && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
            <h2 className="font-semibold text-xl mb-2">Welcome, {profile.sellerName}</h2>
            <p className="text-gray-600 mb-4">Company: {profile.companyName} | Industry: {profile.industry}</p>
            <p className="text-gray-600 mb-4">Location: {profile.location} | Status: {profile.verificationStatus}</p>
            
            {analytics && (
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Listings</div>
                  <div className="text-2xl font-bold text-blue-600">{analytics.totalListings}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Active Listings</div>
                  <div className="text-2xl font-bold text-green-600">{analytics.activeListings}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Views</div>
                  <div className="text-2xl font-bold text-purple-600">{analytics.totalViews}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Total Inquiries</div>
                  <div className="text-2xl font-bold text-orange-600">{analytics.totalInquiries}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Analytics */}
        {analytics && (
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
                        <span className="text-blue-600">{stat.views} views</span> • 
                        <span className="text-green-600 ml-2">{stat.inquiries} inquiries</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Top Performing Listings</h4>
                <div className="space-y-2">
                  {analytics.topPerformingListings?.slice(0, 5).map((listing) => (
                    <div key={listing.listingId} className="p-2 bg-gray-50 rounded">
                      <div className="font-medium text-sm">{listing.title}</div>
                      <div className="text-xs text-gray-600">
                        {listing.views} views • {listing.inquiries} inquiries
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Listings Management */}
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">All Listings (Unlimited)</h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {listings?.map((listing) => (
                <div key={listing.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <p className="text-sm text-gray-600">{listing.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        listing.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        listing.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {listing.status}
                      </span>
                      {listing.isFeatured && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div><span className="font-medium">Industry:</span> {listing.industry}</div>
                    <div><span className="font-medium">Location:</span> {listing.location}</div>
                    <div><span className="font-medium">Revenue:</span> ₹{listing.annualRevenue.toLocaleString()}</div>
                    <div><span className="font-medium">Asking Price:</span> ₹{listing.askingPrice.toLocaleString()}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>Views: {listing.views}</span>
                      <span>Inquiries: {listing.inquiries}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Edit
                      </button>
                      <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700">
                        Boost
                      </button>
                      <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                        Promote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Inquiry Management */}
        {inquiries && inquiries.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Enhanced Inquiry Management</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium">{inquiry.buyerName}</div>
                        <div className="text-sm text-gray-600">{inquiry.message}</div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        inquiry.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        inquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                        <button className="text-green-600 hover:text-green-800 text-sm">Respond</button>
                        <button className="text-purple-600 hover:text-purple-800 text-sm">Schedule Call</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pro Features Highlight */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3">Pro Features Active</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Unlimited listings</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Featured listing boost</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Advanced analytics</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Enhanced inquiry management</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Priority support</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                <span>Performance insights</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
