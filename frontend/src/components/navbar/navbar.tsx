/**
 * components/navbar/navbar.tsx
 * Simple responsive navbar with role selector and upgrade CTA
 */
import React from "react";
import Link from "next/link";
import NAV_LINKS from "./navbar-links";
import { useAuth } from "@/hooks/use-auth";

const Navbar: React.FC = () => {
  const { user, isPro } = useAuth();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-lg font-bold">
            MSMEBazaar
          </Link>
          <nav className="hidden md:flex space-x-3">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-600 hover:text-indigo-600">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <span className="text-sm text-gray-700 hidden sm:inline">Hi, {user.name}</span>
              {!isPro && (
                <Link href="/onboarding" className="inline-flex items-center px-3 py-1 border rounded-md text-sm bg-indigo-600 text-white hover:bg-indigo-700">
                  Upgrade ₹99
                </Link>
              )}
            </>
          ) : (
            <Link href="/login" className="px-3 py-1 text-sm">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
