"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Building2, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Shield,
  TrendingUp,
  Users,
  Crown,
  Star,
  Lock,
  Wallet,
  Phone,
  Mail,
  MapPin,
  FileText,
  Camera,
  Upload,
  AlertCircle,
  Info
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { formatCurrency } from "@/utils/formatters"

// Types
interface OnboardingStep {
  id: string
  title: string
  description: string
  component: React.ComponentType<any>
}

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  occupation: string
  annualIncome: string
  investmentExperience: string
  riskProfile: string
}

interface BusinessProfile {
  businessName: string
  businessType: string
  category: string
  description: string
  website: string
  annualRevenue: string
  fundingStage: string
  seekingFunding: boolean
  fundingGoal: string
}

interface KYCData {
  panNumber: string
  aadhaarNumber: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  documents: {
    panCard: File | null
    aadhaarCard: File | null
    addressProof: File | null
    incomeProof: File | null
  }
}

interface PaymentData {
  selectedPlan: string
  paymentMethod: string
  cardDetails?: {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    cardholderName: string
  }
  upiId?: string
  billingAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
}

const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    period: "Forever",
    description: "Perfect for getting started",
    features: [
      "Browse investment opportunities",
      "Basic portfolio tracking",
      "Email support",
      "Market updates"
    ],
    recommended: false
  },
  {
    id: "premium",
    name: "Premium",
    price: 2499,
    period: "month",
    description: "Best for active investors",
    features: [
      "All Basic features",
      "Advanced analytics",
      "Priority support",
      "Investment insights",
      "Portfolio recommendations",
      "Early access to deals"
    ],
    recommended: true
  },
  {
    id: "pro",
    name: "Pro",
    price: 4999,
    period: "month",
    description: "For serious investors",
    features: [
      "All Premium features",
      "Dedicated account manager",
      "Exclusive investment opportunities",
      "Custom research reports",
      "Direct founder connect",
      "Tax optimization tools"
    ],
    recommended: false
  }
]

// Step Components
const PersonalInfoStep = ({ data, onChange, onNext }: any) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!data.firstName.trim()) newErrors.firstName = "First name is required"
    if (!data.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!data.email.trim()) newErrors.email = "Email is required"
    if (!data.phone.trim()) newErrors.phone = "Phone number is required"
    if (!data.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
    if (!data.occupation.trim()) newErrors.occupation = "Occupation is required"
    if (!data.annualIncome) newErrors.annualIncome = "Annual income is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-gray-600">Tell us about yourself to personalize your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onChange({ email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })}
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <Label htmlFor="occupation">Occupation *</Label>
          <Input
            id="occupation"
            value={data.occupation}
            onChange={(e) => onChange({ occupation: e.target.value })}
            className={errors.occupation ? "border-red-500" : ""}
          />
          {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
        </div>

        <div>
          <Label htmlFor="annualIncome">Annual Income *</Label>
          <Select onValueChange={(value) => onChange({ annualIncome: value })}>
            <SelectTrigger className={errors.annualIncome ? "border-red-500" : ""}>
              <SelectValue placeholder="Select income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-300000">₹0 - ₹3 Lakh</SelectItem>
              <SelectItem value="300000-500000">₹3 - ₹5 Lakh</SelectItem>
              <SelectItem value="500000-1000000">₹5 - ₹10 Lakh</SelectItem>
              <SelectItem value="1000000-2500000">₹10 - ₹25 Lakh</SelectItem>
              <SelectItem value="2500000-5000000">₹25 - ₹50 Lakh</SelectItem>
              <SelectItem value="5000000+">₹50 Lakh+</SelectItem>
            </SelectContent>
          </Select>
          {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
        </div>

        <div>
          <Label htmlFor="investmentExperience">Investment Experience</Label>
          <Select onValueChange={(value) => onChange({ investmentExperience: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
              <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
              <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
              <SelectItem value="expert">Expert (5+ years)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="riskProfile">Risk Profile</Label>
          <Select onValueChange={(value) => onChange({ riskProfile: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select risk tolerance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative - Prefer stable returns</SelectItem>
              <SelectItem value="moderate">Moderate - Balanced risk and return</SelectItem>
              <SelectItem value="aggressive">Aggressive - Higher risk for higher returns</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={handleNext} className="w-full">
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

const BusinessInfoStep = ({ data, onChange, onNext, onBack }: any) => {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!data.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!data.businessType) newErrors.businessType = "Business type is required"
    if (!data.category) newErrors.category = "Category is required"
    if (!data.description.trim()) newErrors.description = "Description is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Building2 className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Business Information</h2>
        <p className="text-gray-600">Tell us about your business (Optional for investors)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={data.businessName}
            onChange={(e) => onChange({ businessName: e.target.value })}
            className={errors.businessName ? "border-red-500" : ""}
          />
          {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
        </div>

        <div>
          <Label htmlFor="businessType">Business Type</Label>
          <Select onValueChange={(value) => onChange({ businessType: value })}>
            <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="msme">MSME</SelectItem>
              <SelectItem value="sme">SME</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
        </div>

        <div>
          <Label htmlFor="category">Industry Category</Label>
          <Select onValueChange={(value) => onChange({ category: value })}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="food">Food & Beverage</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => onChange({ website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <Label htmlFor="annualRevenue">Annual Revenue</Label>
          <Select onValueChange={(value) => onChange({ annualRevenue: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select revenue range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1000000">₹0 - ₹10 Lakh</SelectItem>
              <SelectItem value="1000000-5000000">₹10 - ₹50 Lakh</SelectItem>
              <SelectItem value="5000000-10000000">₹50 Lakh - ₹1 Crore</SelectItem>
              <SelectItem value="10000000-50000000">₹1 - ₹5 Crore</SelectItem>
              <SelectItem value="50000000+">₹5 Crore+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fundingStage">Funding Stage</Label>
          <Select onValueChange={(value) => onChange({ fundingStage: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select funding stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ideation">Ideation</SelectItem>
              <SelectItem value="prototype">Prototype</SelectItem>
              <SelectItem value="early">Early Stage</SelectItem>
              <SelectItem value="growth">Growth Stage</SelectItem>
              <SelectItem value="expansion">Expansion</SelectItem>
              <SelectItem value="mature">Mature</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="description">Business Description</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your business..."
            className={errors.description ? "border-red-500" : ""}
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="md:col-span-2 flex items-center space-x-2">
          <Checkbox
            id="seekingFunding"
            checked={data.seekingFunding}
            onCheckedChange={(checked) => onChange({ seekingFunding: checked })}
          />
          <Label htmlFor="seekingFunding">Currently seeking funding</Label>
        </div>

        {data.seekingFunding && (
          <div className="md:col-span-2">
            <Label htmlFor="fundingGoal">Funding Goal</Label>
            <Input
              id="fundingGoal"
              value={data.fundingGoal}
              onChange={(e) => onChange({ fundingGoal: e.target.value })}
              placeholder="e.g., ₹50 Lakh"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const SubscriptionStep = ({ data, onChange, onNext, onBack }: any) => {
  const handlePlanSelect = (planId: string) => {
    onChange({ selectedPlan: planId })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Crown className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-600">Select the plan that best fits your investment needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all relative ${
              data.selectedPlan === plan.id
                ? "ring-2 ring-blue-500 border-blue-500"
                : "hover:border-gray-300"
            }`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.recommended && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                Recommended
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold">
                  {plan.price === 0 ? "Free" : formatCurrency(plan.price)}
                  {plan.price > 0 && <span className="text-lg font-normal">/{plan.period}</span>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Plan Benefits:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>30-day free trial for Premium and Pro plans</li>
              <li>Cancel anytime, no questions asked</li>
              <li>Secure payment processing</li>
              <li>24/7 customer support</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1" disabled={!data.selectedPlan}>
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

const PaymentStep = ({ data, onChange, onNext, onBack }: any) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  
  const selectedPlan = SUBSCRIPTION_PLANS.find(plan => plan.id === data.selectedPlan)
  const isFree = selectedPlan?.price === 0

  const handlePayment = async () => {
    if (isFree) {
      onNext()
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Payment Successful!",
        description: `Welcome to MSMEBazaar ${selectedPlan?.name}!`,
      })
      
      onNext()
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isFree) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
          <h2 className="text-2xl font-bold">You're All Set!</h2>
          <p className="text-gray-600">No payment required for the Basic plan</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plan Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{selectedPlan?.name} Plan</h3>
                <p className="text-gray-600">{selectedPlan?.description}</p>
              </div>
              <div className="text-2xl font-bold text-green-600">Free</div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button onClick={handlePayment} className="flex-1">
            Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CreditCard className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold">Payment Information</h2>
        <p className="text-gray-600">Secure payment to activate your subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Select Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={data.paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => onChange({ paymentMethod: "card" })}
                    className="justify-start"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card
                  </Button>
                  <Button
                    variant={data.paymentMethod === "upi" ? "default" : "outline"}
                    onClick={() => onChange({ paymentMethod: "upi" })}
                    className="justify-start"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    UPI
                  </Button>
                </div>
              </div>

              {data.paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={data.cardDetails?.cardNumber || ""}
                      onChange={(e) => onChange({
                        cardDetails: { ...data.cardDetails, cardNumber: e.target.value }
                      })}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Select onValueChange={(value) => onChange({
                        cardDetails: { ...data.cardDetails, expiryMonth: value }
                      })}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Select onValueChange={(value) => onChange({
                        cardDetails: { ...data.cardDetails, expiryYear: value }
                      })}>
                        <SelectTrigger>
                          <SelectValue placeholder="YY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <SelectItem key={year} value={String(year).slice(-2)}>
                                {String(year).slice(-2)}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={data.cardDetails?.cvv || ""}
                        onChange={(e) => onChange({
                          cardDetails: { ...data.cardDetails, cvv: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={data.cardDetails?.cardholderName || ""}
                      onChange={(e) => onChange({
                        cardDetails: { ...data.cardDetails, cardholderName: e.target.value }
                      })}
                    />
                  </div>
                </div>
              )}

              {data.paymentMethod === "upi" && (
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="user@paytm"
                    value={data.upiId || ""}
                    onChange={(e) => onChange({ upiId: e.target.value })}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-600" />
            <span>Your payment information is secured with 256-bit SSL encryption</span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{selectedPlan?.name} Plan</span>
                <span>{formatCurrency(selectedPlan?.price || 0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Billing Period</span>
                <span>{selectedPlan?.period}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(selectedPlan?.price || 0)}</span>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-green-800 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  30-day free trial included
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedPlan?.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button 
          onClick={handlePayment} 
          className="flex-1" 
          disabled={isProcessing || !data.paymentMethod}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatCurrency(selectedPlan?.price || 0)} <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

const CompletionStep = () => {
  const router = useRouter()

  return (
    <div className="space-y-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="h-12 w-12 text-green-600" />
      </motion.div>

      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MSMEBazaar!</h2>
        <p className="text-lg text-gray-600">Your account has been successfully created</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center text-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Explore Opportunities</span>
            <span className="text-gray-600">Browse investment opportunities</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Users className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Build Your Portfolio</span>
            <span className="text-gray-600">Start investing in MSMEs</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Star className="h-8 w-8 text-blue-600 mb-2" />
            <span className="font-medium">Track Performance</span>
            <span className="text-gray-600">Monitor your investments</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={() => router.push('/dashboard')} className="w-full" size="lg">
          Go to Dashboard
        </Button>
        <Button variant="outline" onClick={() => router.push('/opportunities')} className="w-full">
          Browse Investment Opportunities
        </Button>
      </div>
    </div>
  )
}

// Main Onboarding Component
export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const { user } = useAuth()
  const router = useRouter()

  const [personalInfo, setPersonalInfo] = useState<UserProfile>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    occupation: "",
    annualIncome: "",
    investmentExperience: "",
    riskProfile: ""
  })

  const [businessInfo, setBusinessInfo] = useState<BusinessProfile>({
    businessName: "",
    businessType: "",
    category: "",
    description: "",
    website: "",
    annualRevenue: "",
    fundingStage: "",
    seekingFunding: false,
    fundingGoal: ""
  })

  const [paymentData, setPaymentData] = useState<PaymentData>({
    selectedPlan: "",
    paymentMethod: "",
    billingAddress: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    }
  })

  const steps: OnboardingStep[] = [
    {
      id: "personal",
      title: "Personal Info",
      description: "Basic information",
      component: PersonalInfoStep
    },
    {
      id: "business",
      title: "Business Info",
      description: "Business details",
      component: BusinessInfoStep
    },
    {
      id: "subscription",
      title: "Choose Plan",
      description: "Select subscription",
      component: SubscriptionStep
    },
    {
      id: "payment",
      title: "Payment",
      description: "Complete purchase",
      component: PaymentStep
    },
    {
      id: "completion",
      title: "Complete",
      description: "All done!",
      component: CompletionStep
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentStepData = steps[currentStep]
  const StepComponent = currentStepData.component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to MSMEBazaar</h1>
          <p className="text-gray-600">Let's set up your account in a few simple steps</p>
        </div>

        {/* Progress */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block w-12 h-px bg-gray-300 mx-4" />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <StepComponent
                    data={
                      currentStep === 0 ? personalInfo :
                      currentStep === 1 ? businessInfo :
                      currentStep === 2 || currentStep === 3 ? paymentData :
                      null
                    }
                    onChange={
                      currentStep === 0 ? (updates: Partial<UserProfile>) => 
                        setPersonalInfo({ ...personalInfo, ...updates }) :
                      currentStep === 1 ? (updates: Partial<BusinessProfile>) => 
                        setBusinessInfo({ ...businessInfo, ...updates }) :
                      currentStep === 2 || currentStep === 3 ? (updates: Partial<PaymentData>) => 
                        setPaymentData({ ...paymentData, ...updates }) :
                      () => {}
                    }
                    onNext={nextStep}
                    onBack={prevStep}
                  />
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}