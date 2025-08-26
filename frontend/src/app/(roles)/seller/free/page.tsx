"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useSellerProfile, useSellerListings, useInquiries, useBasicAnalytics } from "@/services/seller.api";
import { FEATURE_ROUTES } from "@/utils/routes";

export default function SellerFreePage() {
  const { data: profile } = useSellerProfile();
  const { data: listings, isLoading, error } = useSellerListings();
  const { data: inquiries } = useInquiries();
  const { data: analytics } = useBasicAnalytics();

  return (
    <RoleGuard allowedRoles={["seller"]}>
      <section className="space-y-6">
        <h1 className="text-2xl font-bold">Seller Dashboard (Free)</h1>
        
        {profile && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h2 className="font-semibold text-lg">Welcome, {profile.sellerName}</h2>
            <p className="text-sm text-gray-600">Company: {profile.companyName} | Industry: {profile.industry}</p>
            <p className="text-sm text-gray-600">Location: {profile.location} | Status: {profile.verificationStatus}</p>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{analytics.totalListings}</div>
              <div className="text-sm text-gray-600">Total Listings</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-green-600">{analytics.totalViews}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{analytics.totalInquiries}</div>
              <div className="text-sm text-gray-600">Total Inquiries</div>
            </div>
          </div>
        )}

        {isLoading && <p>Loading your listings...</p>}
        {error && <p className="text-red-600">Failed to load listings</p>}

        {listings && listings.length === 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-yellow-800">You have no listings. Post your first listing to get started!</p>
          </div>
        )}

        <div className="grid gap-4">
          {listings?.slice(0, 3).map((listing) => (
            <div key={listing.id} className="border p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg">{listing.title}</h2>
                <span className={`px-2 py-1 rounded text-xs ${
                  listing.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  listing.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {listing.status}
                </span>
              </div>
              <p className="text-gray-600 mb-3">{listing.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div><span className="font-medium">Industry:</span> {listing.industry}</div>
                <div><span className="font-medium">Location:</span> {listing.location}</div>
                <div><span className="font-medium">Revenue:</span> ₹{listing.annualRevenue.toLocaleString()}</div>
                <div><span className="font-medium">Asking Price:</span> ₹{listing.askingPrice.toLocaleString()}</div>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Views: {listing.views}</span>
                <span>Inquiries: {listing.inquiries}</span>
              </div>
            </div>
          ))}
        </div>

        {inquiries && inquiries.length > 0 && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-semibold mb-3">Recent Inquiries</h3>
            <div className="space-y-2">
              {inquiries.slice(0, 3).map((inquiry) => (
                <div key={inquiry.id} className="border-l-4 border-blue-500 pl-3">
                  <div className="font-medium">{inquiry.buyerName}</div>
                  <div className="text-sm text-gray-600">{inquiry.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Free Plan Limitations</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Limited to 3 active listings</li>
            <li>• Basic analytics only</li>
            <li>• No featured listing boost</li>
            <li>• Standard inquiry response time</li>
          </ul>
          <p className="mt-3">
            Want more features? Upgrade to <a href={FEATURE_ROUTES.businessLoans.path} className="text-blue-600 underline font-medium">Pro</a> for multiple listings,
            featured boost, and advanced analytics.
          </p>
        </div>
      </section>
    </RoleGuard>
  );
}
