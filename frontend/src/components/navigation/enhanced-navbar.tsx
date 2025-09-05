"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  User, 
  Building2, 
  Users, 
  TrendingUp, 
  Shield,
  Menu,
  X,
  Bell,
  Settings
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar: React.FC = () => {
  const { user, isPro } = useAuth();
  const pathname = usePathname();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isRolesOpen, setIsRolesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleIcons = {
    buyer: <User className="h-4 w-4" />,
    seller: <Building2 className="h-4 w-4" />,
    agent: <Users className="h-4 w-4" />,
    investor: <TrendingUp className="h-4 w-4" />,
    admin: <Shield className="h-4 w-4" />,
    superadmin: <Shield className="h-4 w-4" />,
  };

  const services = [
    { name: "Business Loans", href: "/business-loans", icon: "💰" },
    { name: "Business Valuation", href: "/business-valuation", icon: "📊" },
    { name: "Market Linkage", href: "/market-linkage", icon: "🔗" },
    { name: "Networking", href: "/networking", icon: "🤝" },
  ];

  const platforms = [
    { name: "Buyer Platform", href: "/buyer/free", icon: roleIcons.buyer },
    { name: "Seller Platform", href: "/seller/free", icon: roleIcons.seller },
    { name: "Agent Platform", href: "/agent/free", icon: roleIcons.agent },
    { name: "Investor Platform", href: "/investor/free", icon: roleIcons.investor },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsServicesOpen(false);
      setIsRolesOpen(false);
      setIsProfileOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors">
            MSMEBazaar
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link 
              href="/" 
              className={cn(
                "text-sm transition-colors",
                isActive('/') ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
              )}
            >
              Home
            </Link>
            
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServicesOpen(!isServicesOpen);
                }}
                className={cn(
                  "flex items-center space-x-1 text-sm transition-colors",
                  isServicesOpen ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                )}
              >
                <span>Services</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isServicesOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50"
                  >
                    {services.map((service, index) => (
                      <motion.div
                        key={service.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          href={service.href} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <span className="mr-3">{service.icon}</span>
                          {service.name}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Platforms Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRolesOpen(!isRolesOpen);
                }}
                className={cn(
                  "flex items-center space-x-1 text-sm transition-colors",
                  isRolesOpen ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                )}
              >
                <span>Platforms</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isRolesOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isRolesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50"
                  >
                    {platforms.map((platform, index) => (
                      <motion.div
                        key={platform.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          href={platform.href} 
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {platform.icon}
                          <span className="ml-2">{platform.name}</span>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Links */}
            {user?.roles?.includes('admin') && (
              <Link 
                href="/admin" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/admin') ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                )}
              >
                Admin
              </Link>
            )}
            {user?.roles?.includes('superadmin') && (
              <Link 
                href="/superadmin" 
                className={cn(
                  "text-sm transition-colors",
                  isActive('/superadmin') ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"
                )}
              >
                Super Admin
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs">3</Badge>
                </Button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileOpen(!isProfileOpen);
                    }}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg p-2 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.primaryRole}</p>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {isPro && <Badge className="mt-1">Pro</Badge>}
                        </div>
                        <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Dashboard
                        </Link>
                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                        <Link href="/logout" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          Sign Out
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t bg-white"
            >
              <div className="py-4 space-y-2">
                <Link href="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Home
                </Link>
                {services.map((service) => (
                  <Link key={service.name} href={service.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {service.name}
                  </Link>
                ))}
                {platforms.map((platform) => (
                  <Link key={platform.name} href={platform.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    {platform.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;
