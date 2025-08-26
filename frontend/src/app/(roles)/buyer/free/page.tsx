// src/app/(roles)/buyer/free/page.tsx
"use client";

import RoleGuard from "@/modules/shared/RoleGuard";
import { useEffect, useState } from "react";
import { useBrowseListings, useBuyerProfile } from "@/services/buyer.api";
import type { MSMEListing } from "@/services/buyer.api";
import { FEATURE_ROUTES } from "@/utils/routes";

export default function BuyerFreePage() {
  const { data: profile } = useBuyerProfile();
  const { data: listings, isLoading, error } = useBrowseListings();

  return (
    <RoleGuard allowedRoles={["buyer"]}>
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Buyer Dashboard (Free)</h1>
        
        {profile && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold">Welcome, {profile.buyerName}</h2>
            <p className="text-sm text-gray-600">Industry: {profile.industry} | Location: {profile.location}</p>
          </div>
        )}

        {isLoading && <p>Loading listings...</p>}
        {error && <p className="text-red-600">Failed to load listings</p>}

        <div className="grid gap-4">
          {listings?.slice(0, 10).map((listing) => (
            <div key={listing.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg">{listing.msmeName}</h2>
              <p className="text-gray-600 mb-2">{listing.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Industry:</span> {listing.industry}
                </div>
                <div>
                  <span className="font-medium">Location:</span> {listing.location}
                </div>
                <div>
                  <span className="font-medium">Revenue:</span> ₹{listing.annualRevenue.toLocaleString()}
                </div>
                <div>
                  <span className="font-medium">Employees:</span> {listing.employeeCount}
                </div>
              </div>
              <button
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                onClick={() => alert("Contact Seller clicked - Limited to 5 contacts per month")}
              >
                Contact Seller (Limited)
              </button>
            </div>
          ))}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Free Plan Limitations</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Limited to 5 seller contacts per month</li>
            <li>• Basic search only</li>
            <li>• No saved searches</li>
            <li>• No advanced analytics</li>
          </ul>
          <p className="mt-3">
            Want more features? Upgrade to <a href={FEATURE_ROUTES.businessLoans.path} className="text-blue-600 underline font-medium">Pro</a> for advanced search,
            unlimited messaging and priority support.
          </p>
        </div>
      </section>
    </RoleGuard>
  );
}
