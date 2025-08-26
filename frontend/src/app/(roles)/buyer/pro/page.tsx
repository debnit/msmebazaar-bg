"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useBuyerProfile, useBrowseListings, useAdvancedSearch, useSavedSearches, useBuyerAnalytics } from "@/services/buyer.api";
import { useState } from "react";

export default function BuyerProPage() {
  const { data: profile } = useBuyerProfile();
  const { data: listings } = useBrowseListings();
  const { data: savedSearches } = useSavedSearches();
  const { data: analytics } = useBuyerAnalytics();
  const [searchFilters, setSearchFilters] = useState({
    industry: '',
    location: '',
    minRevenue: '',
    maxRevenue: ''
  });

  const { data: advancedResults } = useAdvancedSearch(searchFilters);

  return (
    <RoleGuard allowedRoles={["buyer"]} proOnly>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Buyer Pro Dashboard</h1>
        
        {profile && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <h2 className="font-semibold text-xl mb-2">Welcome, {profile.buyerName}</h2>
            <p className="text-gray-600 mb-4">Industry: {profile.industry} | Location: {profile.location}</p>
            
            {analytics && (
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Listings Viewed</div>
                  <div className="text-2xl font-bold">{analytics.totalListingsViewed}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Messages Sent</div>
                  <div className="text-2xl font-bold">{analytics.totalMessagesSent}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Saved Searches</div>
                  <div className="text-2xl font-bold">{analytics.savedSearches}</div>
                </div>
                <div className="bg-white p-3 rounded shadow">
                  <div className="font-medium text-gray-500">Favorites</div>
                  <div className="text-2xl font-bold">{analytics.favoriteListings}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advanced Search */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Advanced Search</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Industry"
              className="border p-2 rounded"
              value={searchFilters.industry}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, industry: e.target.value }))}
            />
            <input
              type="text"
              placeholder="Location"
              className="border p-2 rounded"
              value={searchFilters.location}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Min Revenue"
              className="border p-2 rounded"
              value={searchFilters.minRevenue}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, minRevenue: e.target.value }))}
            />
            <input
              type="number"
              placeholder="Max Revenue"
              className="border p-2 rounded"
              value={searchFilters.maxRevenue}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, maxRevenue: e.target.value }))}
            />
          </div>
        </div>

        {/* Saved Searches */}
        {savedSearches && savedSearches.length > 0 && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Saved Searches</h3>
            <div className="grid gap-2">
              {savedSearches.map((search) => (
                <div key={search.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{search.name}</div>
                    <div className="text-sm text-gray-600">
                      {Object.entries(search.filters).map(([key, value]) => `${key}: ${value}`).join(', ')}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800">Load</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Search Results */}
        {advancedResults && advancedResults.length > 0 && (
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Advanced Search Results</h3>
            <div className="grid gap-4">
              {advancedResults.map((listing) => (
                <div key={listing.id} className="border p-4 rounded-lg">
                  <h4 className="font-semibold text-lg">{listing.msmeName}</h4>
                  <p className="text-gray-600 mb-2">{listing.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">Industry:</span> {listing.industry}</div>
                    <div><span className="font-medium">Location:</span> {listing.location}</div>
                    <div><span className="font-medium">Revenue:</span> ₹{listing.annualRevenue.toLocaleString()}</div>
                    <div><span className="font-medium">Employees:</span> {listing.employeeCount}</div>
                  </div>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                    Contact Seller (Unlimited)
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Listings */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">All Listings</h3>
          <div className="grid gap-4">
            {listings?.map((listing) => (
              <div key={listing.id} className="border p-4 rounded-lg">
                <h4 className="font-semibold text-lg">{listing.msmeName}</h4>
                <p className="text-gray-600 mb-2">{listing.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="font-medium">Industry:</span> {listing.industry}</div>
                  <div><span className="font-medium">Location:</span> {listing.location}</div>
                  <div><span className="font-medium">Revenue:</span> ₹{listing.annualRevenue.toLocaleString()}</div>
                  <div><span className="font-medium">Employees:</span> {listing.employeeCount}</div>
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Contact Seller (Unlimited)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
