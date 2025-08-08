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

  const handlePayment = async () => {
    setIsLoading(true)
    
    // Simulate Razorpay integration
    const options = {
      key: 'rzp_test_1234567890',
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      name: 'MSMEBazaar',
      description: 'MSMEBazaar Pro Subscription',
      handler: function (response: any) {
        console.log('Payment successful:', response)
        setCurrentStep('success')
        setIsLoading(false)
      },
      prefill: {
        name: data.businessName,
        email: 'user@example.com'
      },
      theme: {
        color: '#2563eb'
      }
    }

    // In a real app, you would load Razorpay script and create payment
    setTimeout(() => {
      setCurrentStep('success')
      setIsLoading(false)
    }, 2000)
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
            <Crown className="h-3 w-3 mr-1" />
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

        {/* Step 1: Business Type & Name */}
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
                <Select value={data.businessType} onValueChange={(value) => setData({...data, businessType: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  className="h-11"
                  value={data.businessName}
                  onChange={(e) => setData({...data, businessName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Textarea
                  id="businessDescription"
                  placeholder="Briefly describe what your business does..."
                  className="min-h-[100px]"
                  value={data.businessDescription}
                  onChange={(e) => setData({...data, businessDescription: e.target.value})}
                />
              </div>

              <Button 
                onClick={handleNext}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                disabled={!data.businessType || !data.businessName || isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: KYC Documents */}
        {currentStep === 2 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">KYC Verification</CardTitle>
              <CardDescription>
                Upload your business documents for verification. This helps us serve you better.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  placeholder="ABCDE1234F"
                  className="h-11 uppercase"
                  value={data.panNumber}
                  onChange={(e) => setData({...data, panNumber: e.target.value.toUpperCase()})}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label>PAN Card Document *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('pan', e.target.files[0])}
                    className="hidden"
                    id="pan-upload"
                  />
                  <label htmlFor="pan-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {data.panDocument ? data.panDocument.name : 'Click to upload PAN card'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gstNumber">GST Number (Optional)</Label>
                <Input
                  id="gstNumber"
                  placeholder="22ABCDE1234F1Z5"
                  className="h-11 uppercase"
                  value={data.gstNumber}
                  onChange={(e) => setData({...data, gstNumber: e.target.value.toUpperCase()})}
                  maxLength={15}
                />
              </div>

              {data.gstNumber && (
                <div className="space-y-2">
                  <Label>GST Certificate</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('gst', e.target.files[0])}
                      className="hidden"
                      id="gst-upload"
                    />
                    <label htmlFor="gst-upload" className="cursor-pointer">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {data.gstDocument ? data.gstDocument.name : 'Click to upload GST certificate'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                    </label>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={!data.panNumber || !data.panDocument || isLoading}
                >
                  {isLoading ? "Processing..." : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Choose Goals */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">What's your primary goal?</CardTitle>
              <CardDescription>
                Select your main objective. You can always add more goals later.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {goals.map((goal) => {
                  const Icon = goal.icon
                  const isSelected = data.primaryGoal === goal.id
                  
                  return (
                    <div
                      key={goal.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setData({...data, primaryGoal: goal.id})}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${goal.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Pro Tip</span>
                </div>
                <p className="text-sm text-gray-600">
                  Don't worry about choosing perfectly. MSMEBazaar Pro gives you access to all services, 
                  and you can explore other goals anytime.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={!data.primaryGoal || isLoading}
                >
                  {isLoading ? "Processing..." : "Continue to Payment"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Crown className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Upgrade to MSMEBazaar Pro</CardTitle>
              <CardDescription>
                Get access to all premium features for just ₹99/month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">₹99</div>
                  <div className="text-blue-100">per month</div>
                  <div className="mt-2 text-sm text-blue-100">Cancel anytime</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What's included:</h4>
                <div className="space-y-2">
                  {[
                    'Priority loan processing',
                    'Professional business valuation',
                    'Expert exit strategy consultation',
                    'Premium market linkage network',
                    'Dedicated account manager',
                    '24/7 priority support'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secured by Razorpay</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing Payment..." : "Pay ₹99 & Start"}
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {currentStep === 'success' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-600">Welcome to MSMEBazaar Pro!</CardTitle>
              <CardDescription>
                Your account has been successfully upgraded. Let's get started!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-gray-900">Your Profile Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Business:</span>
                    <span className="font-medium">{data.businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{data.businessType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Primary Goal:</span>
                    <span className="font-medium">
                      {goals.find(g => g.id === data.primaryGoal)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <Badge className="bg-blue-100 text-blue-700">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro (₹99/month)
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">What's next?</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded">
                      <span className="text-xs font-bold text-blue-600">1</span>
                    </div>
                    <span className="text-sm">Complete your business profile</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded">
                      <span className="text-xs font-bold text-blue-600">2</span>
                    </div>
                    <span className="text-sm">Connect with your account manager</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-1 bg-blue-100 rounded">
                      <span className="text-xs font-bold text-blue-600">3</span>
                    </div>
                    <span className="text-sm">Start exploring Pro features</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-11 bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = '/dashboard'}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need help? Contact our support team at{" "}
                  <Link href="mailto:support@msmebazaar.com" className="text-blue-600 hover:underline">
                    support@msmebazaar.com
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
