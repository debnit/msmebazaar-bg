'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, ArrowRight, ArrowLeft, Upload, FileText, Target, DollarSign, TrendingUp, Users, CheckCircle, Crown, Shield, Zap } from 'lucide-react'
import Link from "next/link"

import PaymentCheckout from '@/modules/payment/PaymentCheckout'

type Step = 1 | 2 | 3 | 'payment' | 'success'

interface OnboardingData {
  businessType: string
  businessName: string
  businessDescription: string
  panNumber: string
  gstNumber: string
  panDocument: File | null
  gstDocument: File | null
  primaryGoal: string
  secondaryGoals: string[]
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    businessType: '',
    businessName: '',
    businessDescription: '',
    panNumber: '',
    gstNumber: '',
    panDocument: null,
    gstDocument: null,
    primaryGoal: '',
    secondaryGoals: []
  })

  const businessTypes = [
    'Manufacturing',
    'Trading',
    'Service Provider',
    'Retail',
    'Technology',
    'Healthcare',
    'Education',
    'Food & Beverage',
    'Textile',
    'Other'
  ]

  const goals = [
    {
      id: 'loan',
      title: 'Business Loan',
      description: 'Get funding for expansion, inventory, or working capital',
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'exit',
      title: 'Exit Strategy',
      description: 'Plan your business exit and maximize returns',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'market',
      title: 'Market Linkage',
      description: 'Connect with suppliers, distributors, and customers',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    }
  ]

  const getProgress = () => {
    switch (currentStep) {
      case 1: return 25
      case 2: return 50
      case 3: return 75
      case 'payment': return 90
      case 'success': return 100
      default: return 0
    }
  }

  const handleNext = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
    
    if (currentStep === 3) {
      setCurrentStep('payment')
    } else if (currentStep === 'payment') {
      setCurrentStep('success')
    } else {
      setCurrentStep((prev) => (prev as number + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep(3)
    } else if (currentStep > 1) {
      setCurrentStep((prev) => (prev as number - 1) as Step)
    }
  }

  const handleFileUpload = (type: 'pan' | 'gst', file: File) => {
    setData(prev => ({
      ...prev,
      [`${type}Document`]: file
    }))
  }

  // New callback to advance step on successful payment
  const handlePaymentSuccess = () => {
    setCurrentStep('success')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur">
        <Link href="/" className="flex items-center">
          <Building2 className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">MSMEBazaar</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Crown className="mr-1 h-3 w-3" />
            Pro Onboarding
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              {currentStep === 'payment' ? 'Payment' : 
               currentStep === 'success' ? 'Complete' : 
               `Step ${currentStep} of 3`}
            </span>
            <span className="text-sm text-gray-500">{getProgress()}%</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Step 1 */}
        {currentStep === 1 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Tell us about your business</CardTitle>
              <CardDescription>
                Help us understand your business to provide personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={data.businessType} onValueChange={value => setData({...data, businessType: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" placeholder="Enter your business name" className="h-11"
                  value={data.businessName}
                  onChange={e => setData({...data, businessName: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea id="businessDescription" placeholder="Briefly describe your business" className="min-h-[100px]"
                  value={data.businessDescription}
                  onChange={e => setData({...data, businessDescription: e.target.value})} />
              </div>

              <Button onClick={handleNext} className="w-full bg-blue-600" disabled={!data.businessType || !data.businessName || isLoading}>
                {isLoading ? "Processing..." : "Continue"} <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <Card className="shadow-lg border-0">
          {/* ...existing KYC form, file uploads similar to your code... */}
          </Card>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-0">
          {/* ...existing Goals selection UI... */}
          </Card>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Upgrade to MSMEBazaar Pro</CardTitle>
              <CardDescription>Get access to premium features for ₹99/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PaymentCheckout 
                amount={99} 
                currency="INR" 
                onSuccess={() => setCurrentStep('success')} 
              />
              <Button onClick={handleBack} variant="outline" className="mt-4 w-full">Back</Button>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600">Welcome to MSMEBazaar Pro!</CardTitle>
              <CardDescription>Account successfully upgraded. Let’s get started!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded space-y-3">
                <h4 className="font-semibold">Your Profile Summary:</h4>
                <div>
                  <p><strong>Business:</strong> {data.businessName}</p>
                  <p><strong>Type:</strong> {data.businessType}</p>
                  <p><strong>Primary Goal:</strong> {goals.find(g => g.id === data.primaryGoal)?.title || ''}</p>
                  <p><strong>Plan:</strong> <Badge>Pro (₹99/month)</Badge></p>
                </div>

                <div>
                  <h5>Next Steps:</h5>
                  <ul>
                    <li>Complete your business profile</li>
                    <li>Connect with your account manager</li>
                    <li>Start exploring Pro features</li>
                  </ul>
                </div>

                <Button className="w-full" onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard <ArrowRight className="ml-2" />
                </Button>

                <div className="text-center mt-6 text-sm">
                  Need help? Contact <Link href="mailto:support@msmebazaar.com" className="text-blue-600 underline">support@msmebazaar.com</Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
