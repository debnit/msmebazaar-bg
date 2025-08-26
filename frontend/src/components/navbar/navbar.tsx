/**
 * components/navbar/navbar.tsx
 * Enhanced responsive navbar with role selector, dropdown menus, and upgrade CTA
 */
import React, { useState } from "react";
import Link from "next/link";
import NAV_LINKS, { ROLE_NAV_LINKS } from "./navbar-links";
import { useAuth } from "@/hooks/use-auth";
import { ChevronDown, User, Building2, Users, TrendingUp, Shield } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, isPro } = useAuth();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);

  const roleIcons = {
    buyer: <User className="h-4 w-4" />,
    seller: <Building2 className="h-4 w-4" />,
    agent: <Users className="h-4 w-4" />,
    investor: <TrendingUp className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
    superadmin: <Shield className="h-4 w-4" />,
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-lg font-bold text-blue-600">
            MSMEBazaar
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <Link href="/business-loans" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Business Loans
                  </Link>
                  <Link href="/valuation" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Business Valuation
                  </Link>
                  <Link href="/market-linkage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Market Linkage
                  </Link>
                  <Link href="/networking" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Networking
                  </Link>
                </div>
              )}
            </div>

            {/* Roles Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsRolesOpen(!isRolesOpen)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <span>Platforms</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {isRolesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <Link href="/buyer/free" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {roleIcons.buyer}
                    <span className="ml-2">Buyer Platform</span>
                  </Link>
                  <Link href="/seller/free" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {roleIcons.seller}
                    <span className="ml-2">Seller Platform</span>
                  </Link>
                  <Link href="/agent/free" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {roleIcons.agent}
                    <span className="ml-2">Agent Platform</span>
                  </Link>
                  <Link href="/investor/free" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {roleIcons.investor}
                    <span className="ml-2">Investor Platform</span>
                  </Link>
                  {user?.roles?.includes('admin') && (
                    <Link href="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {roleIcons.admin}
                      <span className="ml-2">Admin Panel</span>
                    </Link>
                  )}
                  {user?.roles?.includes('superadmin') && (
                    <Link href="/superadmin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      {roleIcons.superadmin}
                      <span className="ml-2">Super Admin</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">Hi, {user.name}</span>
              {!isPro && (
                <Link 
                  href="/onboarding" 
                  className="inline-flex items-center px-3 py-1 border rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Upgrade ₹99
                </Link>
              )}
              {/* User Role Quick Access */}
              {user.roles && user.roles.length > 0 && (
                <div className="hidden md:flex items-center space-x-2">
                  {user.roles.slice(0, 2).map((role) => (
                    <Link
                      key={role}
                      href={ROLE_NAV_LINKS[role]?.[0]?.href || "/dashboard"}
                      className="flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      {roleIcons[role as keyof typeof roleIcons]}
                      <span className="ml-1 capitalize">{role}</span>
                    </Link>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <Link href="/login" className="px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link 
                href="/register" 
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t">
        <div className="container mx-auto px-4 py-2">
          <div className="grid grid-cols-2 gap-2">
            <Link 
              href="/buyer/free" 
              className="flex items-center justify-center px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              {roleIcons.buyer}
              <span className="ml-1">Buyer</span>
            </Link>
            <Link 
              href="/seller/free" 
              className="flex items-center justify-center px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              {roleIcons.seller}
              <span className="ml-1">Seller</span>
            </Link>
            <Link 
              href="/agent/free" 
              className="flex items-center justify-center px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              {roleIcons.agent}
              <span className="ml-1">Agent</span>
            </Link>
            <Link 
              href="/investor/free" 
              className="flex items-center justify-center px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
            >
              {roleIcons.investor}
              <span className="ml-1">Investor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isServicesOpen || isRolesOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsServicesOpen(false);
            setIsRolesOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;
