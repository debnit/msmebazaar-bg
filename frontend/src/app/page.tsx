'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, TrendingUp, DollarSign, Users, CheckCircle, ArrowRight, Award, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { EnquiryForm } from '@/components/enquiry-form';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { getPostLoginRedirect, FEATURE_ROUTES } from '@/utils/routes';

export default function MSMEBazaarLanding() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur sticky top-0 z-50">
        <Link className="flex items-center" href="/">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">MSMEBazaar</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link href="#features" className="text-sm hover:text-blue-600">Services</Link>
          <Link href="#testimonials" className="text-sm hover:text-blue-600">Reviews</Link>
          <Link href="#pricing" className="text-sm hover:text-blue-600">Pricing</Link>
          <Link href="#contact" className="text-sm hover:text-blue-600">Contact</Link>

          <div className="ml-4">
            {isAuthenticated ? (
              <Button
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => router.push(getPostLoginRedirect(user))}
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="bg-blue-600 text-white">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <Badge variant="secondary" className="w-fit">Trusted by 10,000+ MSMEs</Badge>
              <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                Grow Your MSME with <span className="text-blue-600">Expert Solutions</span>
              </h1>
              <p className="max-w-[600px] text-gray-600 md:text-xl">
                Get loans, valuations, exit strategies, and market linkages all in one platform.
              </p>
              <div className="flex gap-2">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Started for ₹99
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
            <Image
              src="/modern-business-dashboard.png"
              width={600} height={400}
              alt="Dashboard"
              className="rounded-xl shadow-2xl"
            />
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-12 md:py-24">
          <div className="container grid gap-6 lg:grid-cols-2">
            <Card onClick={() => router.push(FEATURE_ROUTES.businessLoans.path)}
              className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <CardTitle>Business Loans</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Quick and affordable MSME loans.</CardDescription>
              </CardContent>
            </Card>

            <Card onClick={() => router.push(FEATURE_ROUTES.businessValuation.path)}
              className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  <CardTitle>Business Valuation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Certified valuations for funding or sale.</CardDescription>
              </CardContent>
            </Card>

            <Card onClick={() => router.push(FEATURE_ROUTES.exitStrategy.path)}
              className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-purple-600" />
                  <CardTitle>Exit Strategy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Plan a profitable business exit.</CardDescription>
              </CardContent>
            </Card>

            <Card onClick={() => router.push(FEATURE_ROUTES.marketLinkage.path)}
              className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-orange-600" />
                  <CardTitle>Market Linkage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>Expand your market & find partners.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full bg-green-500"
          onClick={() => {
            window.open(`https://wa.me/919999999999?text=${encodeURIComponent("Hi, I need help.")}`, "_blank");
          }}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
