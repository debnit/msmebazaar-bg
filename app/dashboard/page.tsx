'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Bell, ChevronDown, ArrowRight, Upload, Shield, DollarSign, TrendingUp, Bot, Package, Users, Network, CheckCircle, Star, MessageCircle, HelpCircle, Phone, FileText, Target, Zap, Crown, Award } from 'lucide-react'
import Link from "next/link"

export default function Dashboard() {
  const [user] = useState({
    name: 'Ramesh Kumar',
    email: 'ramesh@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    onboardingStep: 1,
    totalSteps: 3,
    isProMember: false
  })

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const loanSteps = [
    {
      step: 1,
      title: 'Upload Documents',
      description: 'PAN, GST, Bank statements',
      icon: Upload,
      completed: user.onboardingStep > 1
    },
    {
      step: 2,
      title: 'Verify KYC',
      description: 'Quick verification process',
      icon: Shield,
      completed: user.onboardingStep > 2
    },
    {
      step: 3,
      title: 'Get Loan Offer',
      description: 'Instant pre-approved offers',
      icon: DollarSign,
      completed: user.onboardingStep > 3
    }
  ]

  const services = [
    {
      title: 'Exit-as-a-Service',
      description: 'Strategic exit planning and business sale assistance',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      badge: 'Premium',
      href: '/services/exit'
    },
    {
      title: 'AI-powered Valuation',
      description: 'Get accurate business valuation using AI technology',
      icon: Bot,
      color: 'bg-blue-100 text-blue-600',
      badge: 'New',
      href: '/services/valuation'
    },
    {
      title: 'Raw Material Procurement',
      description: 'Connect with verified suppliers and get best rates',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      badge: null,
      href: '/services/procurement'
    },
    {
      title: 'Market Linkage',
      description: 'Expand your market reach and find new customers',
      icon: Target,
      color: 'bg-orange-100 text-orange-600',
      badge: null,
      href: '/services/market-linkage'
    },
    {
      title: 'MSME Networking',
      description: 'Connect with fellow entrepreneurs and industry experts',
      icon: Network,
      color: 'bg-indigo-100 text-indigo-600',
      badge: 'Community',
      href: '/services/networking'
    }
  ]

  const trustLogos = [
    'RBI Approved',
    'ISO Certified',
    'MSME Registered',
    'Startup India'
  ]

  const testimonials = [
    {
      name: 'Priya Sharma',
      business: 'TechStart Solutions',
      text: 'Got ₹25L loan in just 5 days!',
      rating: 5
    },
    {
      name: 'Amit Patel',
      business: 'Patel Manufacturing',
      text: 'Excellent service and support.',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MSMEBazaar</span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <div className="p-2">
                      <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Loan application approved!</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">KYC verification pending</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                      <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                        <p className="text-sm font-medium">Welcome to MSMEBazaar!</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 p-2"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-2">
                      <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                        Profile Settings
                      </Link>
                      <Link href="/billing" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                        Billing & Plans
                      </Link>
                      <Link href="/support" className="block px-3 py-2 text-sm hover:bg-gray-50 rounded-lg">
                        Help & Support
                      </Link>
                      <hr className="my-2" />
                      <button className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg text-red-600">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to grow your business? Let's start with getting you the funding you need.
          </p>
        </div>

        {/* Onboarding Progress (if not completed) */}
        {user.onboardingStep <= 3 && (
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-blue-900">Complete Your Onboarding</h3>
                  <p className="text-sm text-blue-700">Step {user.onboardingStep} of {user.totalSteps}</p>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  {Math.round((user.onboardingStep / user.totalSteps) * 100)}% Complete
                </Badge>
              </div>
              <Progress value={(user.onboardingStep / user.totalSteps) * 100} className="mb-4" />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Continue Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Start Your MSME Journey - Loan CTA */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your MSME Journey</h2>
          
          {/* Main Loan CTA Card */}
          <Card className="relative overflow-hidden border-2 border-blue-200 shadow-lg mb-6">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-transparent w-32 h-full opacity-10"></div>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      <Zap className="h-3 w-3 mr-1" />
                      Quick Approval
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Special Offer
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Get Business Loan for just{' '}
                    <span className="text-blue-600">₹99</span>
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    Start your loan application today and get pre-approved offers up to ₹50 lakhs. 
                    Minimal documentation, quick processing, competitive rates.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none">
                      Apply for Loan Now - ₹99
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1 sm:flex-none">
                      Learn More
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      No hidden charges
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Quick approval
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Flexible repayment
                    </div>
                  </div>
                </div>

                {/* 3-Step Process */}
                <div className="bg-white p-6 rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-4">Simple 3-Step Process</h4>
                  <div className="space-y-4">
                    {loanSteps.map((step, index) => {
                      const Icon = step.icon
                      return (
                        <div key={index} className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${
                            step.completed 
                              ? 'bg-green-100 text-green-600' 
                              : user.onboardingStep === step.step
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : (
                              <Icon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{step.title}</span>
                              {step.completed && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  Completed
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-sm text-gray-600">
            <span className="font-medium">Trusted by 10,000+ MSMEs</span>
            <div className="flex gap-4">
              {trustLogos.map((logo, index) => (
                <Badge key={index} variant="outline" className="bg-white">
                  <Shield className="h-3 w-3 mr-1" />
                  {logo}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Explore Other Services */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Explore Other Services</h2>
            {!user.isProMember && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Upgrade to Pro
              </Badge>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${service.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {service.badge && (
                        <Badge variant="secondary" className="text-xs">
                          {service.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base mb-4">
                      {service.description}
                    </CardDescription>
                    <Button variant="outline" className="w-full group-hover:bg-blue-50 group-hover:border-blue-200">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-4">
                    "{testimonial.text}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.business}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <FileText className="h-5 w-5" />
              <span className="text-sm">View Applications</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Find Partners</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Award className="h-5 w-5" />
              <span className="text-sm">Business Score</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm">Get Help</span>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="ml-2 text-lg font-bold">MSMEBazaar</span>
              </div>
              <p className="text-sm text-gray-600">
                Empowering MSMEs with comprehensive business solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <Link href="/loans" className="block text-gray-600 hover:text-blue-600">Apply for Loan</Link>
                <Link href="/valuation" className="block text-gray-600 hover:text-blue-600">Business Valuation</Link>
                <Link href="/exit" className="block text-gray-600 hover:text-blue-600">Exit Strategy</Link>
                <Link href="/networking" className="block text-gray-600 hover:text-blue-600">MSME Network</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <Link href="/help" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <HelpCircle className="h-4 w-4" />
                  Help Center
                </Link>
                <Link href="tel:+919876543210" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Phone className="h-4 w-4" />
                  +91 98765 43210
                </Link>
                <Link href="mailto:support@msmebazaar.com" className="block text-gray-600 hover:text-blue-600">
                  support@msmebazaar.com
                </Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Get Instant Help</h4>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp Support
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Available 24/7 for urgent queries
              </p>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 MSMEBazaar. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-blue-600">Privacy</Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-blue-600">Terms</Link>
              <Link href="/security" className="text-sm text-gray-600 hover:text-blue-600">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="rounded-full bg-green-600 hover:bg-green-700 shadow-lg h-14 w-14 p-0"
          onClick={() => window.open('https://wa.me/919876543210', '_blank')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
