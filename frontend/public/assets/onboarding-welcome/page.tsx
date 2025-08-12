
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, CheckCircle, Star, Shield, CreditCard, Smartphone, ArrowRight, Zap, Crown, DollarSign, TrendingUp, Users, Award, Sparkles } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function OnboardingWelcome() {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessingPayment(false)
      setPaymentSuccess(true)
      
      // Redirect to dashboard after success
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 3000)
    }, 2000)
  }

  const features = [
    {
      icon: DollarSign,
      title: 'Business Loans',
      description: 'Get loans up to ₹50 lakhs with minimal documentation'
    },
    {
      icon: TrendingUp,
      title: 'Exit Strategy',
      description: 'Professional guidance for business sale and exits'
    },
    {
      icon: Award,
      title: 'Business Valuation',
      description: 'AI-powered accurate business valuation reports'
    },
    {
      icon: Users,
      title: 'Market Linkage',
      description: 'Connect with suppliers, distributors, and customers'
    }
  ]

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      business: 'Kumar Textiles',
      text: 'Got ₹25 lakh loan in just 2 weeks. Best decision for my business!',
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'Priya Sharma',
      business: 'TechStart Solutions',
      text: 'The business valuation helped us raise ₹1 crore in funding.',
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    },
    {
      name: 'Amit Patel',
      business: 'Patel Manufacturing',
      text: 'Excellent market linkage program. Sales increased by 40%!',
      rating: 5,
      avatar: '/placeholder.svg?height=40&width=40'
    }
  ]

  const paymentMethods = [
    { name: 'UPI', icon: '📱' },
    { name: 'Cards', icon: '💳' },
    { name: 'Net Banking', icon: '🏦' },
    { name: 'Wallets', icon: '👛' }
  ]

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center shadow-2xl border-0">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h2>
              <p className="text-gray-600">
                Welcome to MSMEBazaar Pro! Your MSME journey starts now.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-bold text-green-600">₹99</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Plan:</span>
                <Badge className="bg-blue-100 text-blue-700">
                  <Crown className="h-3 w-3 mr-1" />
                  MSMEBazaar Pro
                </Badge>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Redirecting to your dashboard in a few seconds...
            </p>
            
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur">
        <Link href="/" className="flex items-center">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MSMEBazaar</span>
        </Link>
        <div className="ml-auto">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Sparkles className="h-3 w-3 mr-1" />
            Welcome Aboard!
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Welcome Message */}
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  <Crown className="h-3 w-3 mr-1" />
                  Welcome to MSMEBazaar
                </Badge>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Start your{' '}
                  <span className="text-blue-600">MSME journey</span>{' '}
                  for just{' '}
                  <span className="text-green-600">₹99</span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed">
                  One-time onboarding to unlock business loans, exit strategies, 
                  valuations, market linkage & more. Join 10,000+ successful MSMEs.
                </p>
              </div>

              {/* Payment CTA Card */}
              <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-r from-blue-50 to-white">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Start for just ₹99
                      </h2>
                      <p className="text-gray-600">
                        One-time onboarding to unlock loan, exit, valuation & more
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button 
                        size="lg" 
                        className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                        onClick={handlePayment}
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            Pay ₹99 & Continue
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>

                      {/* Payment Methods */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span>Secure payment powered by Razorpay</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4">
                          {paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="text-lg">{method.icon}</span>
                              <span>{method.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">₹50L</div>
                        <div className="text-sm text-gray-600">Max Loan Amount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">24hrs</div>
                        <div className="text-sm text-gray-600">Quick Approval</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  No hidden charges
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Cancel anytime
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Instant activation
                </div>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <Image
                  src="/placeholder.svg?height=500&width=500&text=MSME+Growth+Illustration"
                  alt="MSME Business Growth Illustration"
                  width={500}
                  height={500}
                  className="rounded-2xl shadow-2xl"
                />
                {/* Floating Elements */}
                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Loan Approved</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Growth +40%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You Get with MSMEBazaar Pro
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive business solutions designed specifically for MSMEs to grow, 
              scale, and succeed in today's competitive market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by 10,000+ MSMEs
            </h2>
            <p className="text-gray-600">
              See what our customers say about their success stories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-700 mb-4">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.business}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of successful MSMEs who have grown their businesses with us.
              Start your journey today for just ₹99.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-blue-600 hover:bg-gray-100 h-14 px-8 text-lg"
              onClick={handlePayment}
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="mr-2 h-5 w-5" />
                  Start for ₹99
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-bold">MSMEBazaar</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-600">Terms of Service</Link>
              <Link href="/support" className="hover:text-blue-600">Support</Link>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t text-sm text-gray-500">
            © 2024 MSMEBazaar. All rights reserved. | Secure payments by Razorpay
          </div>
        </div>
      </footer>
    </div>
  )
}
