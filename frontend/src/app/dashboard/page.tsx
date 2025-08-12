"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2, Bell, ChevronDown, ArrowRight, Upload, Shield, DollarSign,
  TrendingUp, Bot, Package, Users, Network, CheckCircle, Star, MessageCircle,
  HelpCircle, Phone, FileText, Target, Zap, Crown, Award, ShoppingCart, Heart, ListChecks
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuthStore } from "@/store/auth.store";
import { ROLE_ROUTES } from "@/utils/routes";
import { api } from "@/services/api-client";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setUser, clearAuth } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Onboarding steps
  const loanSteps = [
    { step: 1, title: "Upload Documents", description: "PAN, GST, Bank statements", icon: Upload },
    { step: 2, title: "Verify KYC", description: "Quick verification process", icon: Shield },
    { step: 3, title: "Get Loan Offer", description: "Instant pre-approved offers", icon: DollarSign }
  ];

  // Services list
  const services = [
    { title: "Exit-as-a-Service", description: "Strategic exit planning and business sale assistance", icon: TrendingUp, color: "bg-purple-100 text-purple-600", badge: "Premium", href: "/services/exit" },
    { title: "AI-powered Valuation", description: "Get accurate business valuation using AI technology", icon: Bot, color: "bg-blue-100 text-blue-600", badge: "New", href: "/services/valuation" },
    { title: "Raw Material Procurement", description: "Connect with verified suppliers and get best rates", icon: Package, color: "bg-green-100 text-green-600", badge: null, href: "/services/procurement" },
    { title: "Market Linkage", description: "Expand your market reach and find new customers", icon: Target, color: "bg-orange-100 text-orange-600", badge: null, href: "/services/market-linkage" },
    { title: "MSME Networking", description: "Connect with fellow entrepreneurs and industry experts", icon: Network, color: "bg-indigo-100 text-indigo-600", badge: "Community", href: "/services/networking" }
  ];

  // Role-specific stats config
  const roleStatsConfig: Record<string, Array<{ label: string; key: string; icon: any }>> = {
    buyer: [
      { label: "Orders Placed", key: "ordersPlaced", icon: ShoppingCart },
      { label: "Favourite Sellers", key: "favSellers", icon: Heart }
    ],
    seller: [
      { label: "Orders Received", key: "ordersReceived", icon: Package },
      { label: "Active Listings", key: "activeListings", icon: ListChecks }
    ],
    agent: [
      { label: "Deals Closed", key: "dealsClosed", icon: Package },
      { label: "Active Leads", key: "activeLeads", icon: Users }
    ],
    default: [
      { label: "Applications", key: "applications", icon: FileText },
      { label: "Partners", key: "partners", icon: Users }
    ]
  };

  // Fetch user profile + stats
  useEffect(() => {
    (async () => {
      try {
        const profileRes = await api.user.getProfile();
        if (profileRes.success && profileRes.data) {
          setUser(profileRes.data);
          const role = profileRes.data.primaryRole;
          const analyticsRes = await api.analytics.getDashboard({ role });
          if (analyticsRes.success && analyticsRes.data) {
            setStats(analyticsRes.data);
          }
        } else {
          setError(profileRes.message || "Unable to load profile");
        }
      } catch (err: any) {
        setError(err.message || "Dashboard load error");
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser]);

  const handleLogout = async () => {
    await api.auth.logout();
    clearAuth();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
        <div className="mt-4"><Button onClick={() => window.location.reload()}>Retry</Button></div>
      </div>
    );
  }

  const primaryRole = user?.primaryRole;
  const statsConfig = roleStatsConfig[primaryRole || "default"] || roleStatsConfig.default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4">
          <Link href="/" className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">MSMEBazaar</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <div className="relative">
              <Button variant="ghost" className="flex items-center gap-2" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user?.name?.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block">{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow border rounded-lg text-sm">
                  <Link href="/profile" className="block px-3 py-2 hover:bg-gray-50">Profile</Link>
                  <Link href="/billing" className="block px-3 py-2 hover:bg-gray-50">Billing</Link>
                  <hr />
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-600 mb-6">Your personalized MSME dashboard.</p>

        {/* Pro CTA */}
        {!user?.isPro && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader><CardTitle className="flex items-center gap-2">Upgrade to Pro <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">Pro</Badge></CardTitle></CardHeader>
            <CardContent>
              <CardDescription className="mb-4">Unlock more features: analytics, unlimited messaging, premium support.</CardDescription>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/onboarding")}>
                Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Role-aware analytics widgets */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsConfig.map(({ label, key, icon: Icon }) => (
              <Card key={key}>
                <CardHeader className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <CardTitle>{label}</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{stats[key] ?? 0}</CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Explore Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, idx) => {
              const Icon = s.icon;
              return (
                <Card key={idx} className="hover:shadow-lg cursor-pointer" onClick={() => router.push(s.href)}>
                  <CardHeader className="flex items-center gap-2">
                    <div className={`p-3 rounded-lg ${s.color}`}><Icon className="h-6 w-6" /></div>
                    <CardTitle>{s.title}</CardTitle>
                    {s.badge && <Badge variant="secondary">{s.badge}</Badge>}
                  </CardHeader>
                  <CardContent><CardDescription>{s.description}</CardDescription></CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-1"><FileText className="h-5 w-5" />View Applications</Button>
            <Button variant="outline" className="h-16 flex-col gap-1"><Users className="h-5 w-5" />Find Partners</Button>
            <Button variant="outline" className="h-16 flex-col gap-1"><Award className="h-5 w-5" />Business Score</Button>
            <Button variant="outline" className="h-16 flex-col gap-1"><HelpCircle className="h-5 w-5" />Get Help</Button>
          </div>
        </section>
      </main>

      {/* WhatsApp Floating */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full bg-green-600 hover:bg-green-700 h-14 w-14 p-0" onClick={() => window.open("https://wa.me/919876543210", "_blank")}>
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
