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

  async function submitKyc() {
    const { panNumber, gstNumber, panDocument, gstDocument } = data;
    if (!panNumber || !panDocument) return false;
    try {
      const { kycApi } = await import("@/services/kyc.api");
      const resp = await kycApi.uploadKyc({ panNumber, gstNumber, panDocument, gstDocument: gstDocument || undefined });
      return !!resp.success;
    } catch (e) {
      console.error("KYC upload failed", e);
      return false;
    }
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
            <CardHeader>
              <CardTitle className="text-2xl">KYC Details</CardTitle>
              <CardDescription>Provide your PAN/GST details to proceed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    placeholder="ABCDE1234F"
                    value={data.panNumber}
                    onChange={(e) => setData({ ...data, panNumber: e.target.value.toUpperCase() })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number</Label>
                  <Input
                    id="gstNumber"
                    placeholder="22ABCDE1234F1Z5"
                    value={data.gstNumber}
                    onChange={(e) => setData({ ...data, gstNumber: e.target.value.toUpperCase() })}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="panDocument">Upload PAN Document *</Label>
                  <Input
                    id="panDocument"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload('pan', f);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gstDocument">Upload GST Document (optional)</Label>
                  <Input
                    id="gstDocument"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload('gst', f);
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2" /> Back
                </Button>
                <Button
                  className="bg-blue-600"
                  onClick={async () => { setIsLoading(true); const ok = await submitKyc(); setIsLoading(false); if (ok) handleNext(); }}
                  disabled={!data.panNumber || !data.panDocument || isLoading}
                >
                  {isLoading ? 'Saving KYC...' : 'Continue'} <ArrowRight className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-2xl">What is your primary goal?</CardTitle>
              <CardDescription>Select your main objective and optional secondary goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setData({ ...data, primaryGoal: g.id })}
                      className={`text-left p-4 rounded border transition ${
                        data.primaryGoal === g.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`inline-flex p-2 rounded ${g.color} mb-2`}>
                        <g.icon className="h-5 w-5" />
                      </div>
                      <div className="font-semibold">{g.title}</div>
                      <div className="text-sm text-gray-600">{g.description}</div>
                    </button>
                  ))}
                </div>

                <div>
                  <Label className="mb-2 block">Secondary Goals (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((g) => {
                      const active = data.secondaryGoals.includes(g.id);
                      return (
                        <button
                          key={`sec-${g.id}`}
                          type="button"
                          onClick={() => {
                            setData((prev) => {
                              const set = new Set(prev.secondaryGoals);
                              if (set.has(g.id)) set.delete(g.id); else set.add(g.id);
                              return { ...prev, secondaryGoals: Array.from(set) };
                            });
                          }}
                          className={`px-3 py-1 rounded-full text-sm border ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200'}`}
                        >
                          {g.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="mr-2" /> Back
                </Button>
                <Button
                  className="bg-blue-600"
                  onClick={handleNext}
                  disabled={!data.primaryGoal || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Proceed to Payment'} <ArrowRight className="ml-2" />
                </Button>
              </div>
            </CardContent>
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
