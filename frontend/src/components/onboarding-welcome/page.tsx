'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle, Crown, Zap, ArrowRight, Shield, DollarSign, TrendingUp, Users, Award, Sparkles } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

import PaymentCheckout from '@/modules/payment/PaymentCheckout'

export default function OnboardingWelcome() {
  const [paymentDone, setPaymentDone] = useState(false)
  const [processing, setProcessing] = useState(false)

  // Handler after payment succeeds
  const handlePaymentSuccess = () => {
    setPaymentDone(true)
    setTimeout(() => {
      // Redirect after short delay
      window.location.href = '/dashboard'
    }, 3000)
  }

  // Optional: Payment processing state managed inside PaymentCheckout 
  // but you can tie it here if needed

  if (paymentDone) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
              <p>Welcome to MSMEBazaar Pro! Your MSME journey starts now.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Amount Paid:</span>
                <span className="font-semibold">₹99</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Plan:</span>
                <Badge className="flex items-center gap-1">
                  <Crown className="h-4 w-4" /> MSMEBazaar Pro
                </Badge>
              </div>
            </div>
            <p className="mt-4">Redirecting to dashboard...</p>
            <div className="flex justify-center mt-4">
              <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-indigo-50">
      <header className="px-4 py-4 border-b border-gray-300 flex items-center gap-4">
        <Building2 className="text-indigo-600 w-6 h-6" />
        <h1 className="text-2xl font-semibold text-indigo-900">Welcome to MSMEBazaar</h1>
        <Badge variant="secondary" className="ml-auto bg-indigo-100 text-indigo-800 flex items-center gap-1">
          <Sparkles /> Getting Started
        </Badge>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/2 space-y-8">
            <h2 className="text-3xl font-bold text-indigo-900">Start your MSME journey for just ₹99</h2>
            <p className="text-gray-700 text-lg">
              One-time onboarding fee unlocks loans, valuations, exit planning, market linkage, and more.
            </p>

            {/* Payment Checkout integration */}
            <PaymentCheckout amount={99} currency="INR" onSuccess={handlePaymentSuccess} />

            <div className="mt-4 text-sm text-gray-600 flex gap-4">
              <div className="flex items-center gap-1">
                <Shield className="text-gray-500 w-5 h-5" /> Secure payments by Razorpay
              </div>
              <div className="flex items-center gap-1">
                <Zap className="text-yellow-500 w-5 h-5" /> Instant activation
              </div>
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <Image
              src="/onboarding-illustration.svg"
              alt="MSME Growth Illustration"
              width={500}
              height={500}
            />
            {/* Add decorative badges or floating UI if desired */}
          </div>
        </div>

        {/* Feature highlights */}
        <section className="mt-16">
          <h3 className="text-2xl font-semibold mb-6 text-indigo-900">Features You Get</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: DollarSign, title: 'Business Loans', desc: 'Up to ₹50 lakh with minimal docs' },
              { icon: TrendingUp, title: 'Exit Strategy', desc: 'Expert guidance for your exit plan' },
              { icon: Award, title: 'Business Valuation', desc: 'AI-driven valuations' },
              { icon: Users, title: 'Market Linkage', desc: 'Connect to buyers and suppliers' }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center space-x-4 bg-white p-4 rounded shadow">
                <feature.icon className="w-8 h-8 text-indigo-600" />
                <div>
                  <h4 className="font-semibold text-indigo-900">{feature.title}</h4>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-300 p-4 text-center text-gray-500">
        © 2024 MSMEBazaar. All rights reserved.
      </footer>
    </div>
  )
}
