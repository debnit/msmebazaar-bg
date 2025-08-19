// inside Version 1 landing page

"use client";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { getPostLoginRedirect } from "@/utils/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { Building2, TrendingUp, DollarSign, Users, Star, CheckCircle, Phone, Mail, MapPin, ArrowRight, Shield, Clock, Award, MessageCircle } from "lucide-react";
import Link from "next/link";



export default function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur sticky top-0 z-50">
      {/* Logo */}
      <Link className="flex items-center" href="/">
        <Building2 className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-2xl font-bold text-gray-900">MSMEBazaar</span>
      </Link>

      {/* Navigation */}
      <nav className="ml-auto flex gap-4 items-center">
        <Link href="#services" className="text-sm hover:text-blue-600">Services</Link>
        <Link href="#about" className="text-sm hover:text-blue-600">About</Link>
        <Link href="#contact" className="text-sm hover:text-blue-600">Contact</Link>

        {/* Auth Buttons */}
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
  );
}
