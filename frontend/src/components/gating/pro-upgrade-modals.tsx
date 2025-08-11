"use client"

import { useState } from "react"
import { X, Check, Star, Zap, Shield, BarChart3, Users, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePro } from "@/hooks/use-pro"
import { useAnalytics } from "@/components/analytics-tracker"
import { formatCurrency } from "@/utils/formatters"

interface ProUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  feature?: string
  source?: string
}

const PRO_FEATURES = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Detailed business insights and performance metrics",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Add unlimited team members and manage roles",
  },
  {
    icon: Shield,
    title: "Priority Support",
    description: "24/7 dedicated support with faster response times",
  },
  {
    icon: Zap,
    title: "API Access",
    description: "Full API access for custom integrations",
  },
  {
    icon: CreditCard,
    title: "Advanced Payments",
    description: "Multiple payment gateways and recurring billing",
  },
  {
    icon: Star,
    title: "Premium Features",
    description: "Access to all premium tools and features",
  },
]

const PRICING_PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: 999,
    period: "month",
    discount: null,
    popular: false,
  },
  {
    id: "yearly",
    name: "Yearly",
    price: 9999,
    period: "year",
    discount: "17% OFF",
    popular: true,
    monthlyEquivalent: 833,
  },
]

export default function ProUpgradeModal({ isOpen, onClose, feature, source = "modal" }: ProUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState("yearly")
  const [isLoading, setIsLoading] = useState(false)
  const { upgradeToPro } = usePro()
  const { trackEvent } = useAnalytics()

  if (!isOpen) return null

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)

    try {
      trackEvent("pro_upgrade_initiated", {
        plan: planId,
        feature,
        source,
        timestamp: new Date().toISOString(),
      })

      await upgradeToPro(planId)

      trackEvent("pro_upgrade_completed", {
        plan: planId,
        feature,
        source,
      })

      onClose()
    } catch (error) {
      console.error("Upgrade failed:", error)
      trackEvent("pro_upgrade_failed", {
        plan: planId,
        feature,
        source,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    trackEvent("pro_upgrade_modal_closed", {
      feature,
      source,
      selectedPlan,
    })
    onClose()
  }

  const selectedPlanData = PRICING_PLANS.find((plan) => plan.id === selectedPlan)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl mx-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upgrade to MSMEBazaar Pro</h2>
            <p className="text-gray-600 mt-1">Unlock powerful features to grow your business</p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {/* Feature Highlight */}
          {feature && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Unlock "{feature}" with Pro</span>
              </div>
              <p className="text-blue-700 text-sm">
                This feature is available exclusively for Pro subscribers. Upgrade now to access this and many more
                powerful tools.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Features List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">What's included:</h3>
              <div className="space-y-4">
                {PRO_FEATURES.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{feature.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Testimonial */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic">
                  "MSMEBazaar Pro has transformed how we manage our business. The analytics and team features are
                  game-changers!"
                </p>
                <p className="text-xs text-gray-500 mt-2">- Rajesh Kumar, Mumbai Textiles</p>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose your plan:</h3>

              <div className="space-y-3 mb-6">
                {PRICING_PLANS.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlan === plan.id ? "ring-2 ring-blue-500 border-blue-500" : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              selectedPlan === plan.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                            }`}
                          >
                            {selectedPlan === plan.id && (
                              <div className="w-full h-full rounded-full bg-white scale-50" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{plan.name}</span>
                              {plan.popular && (
                                <Badge variant="secondary" className="text-xs">
                                  Most Popular
                                </Badge>
                              )}
                              {plan.discount && (
                                <Badge variant="destructive" className="text-xs">
                                  {plan.discount}
                                </Badge>
                              )}
                            </div>
                            {plan.monthlyEquivalent && (
                              <p className="text-sm text-gray-600">{formatCurrency(plan.monthlyEquivalent)}/month</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{formatCurrency(plan.price)}</div>
                          <div className="text-sm text-gray-600">per {plan.period}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Upgrade Button */}
              <Button
                onClick={() => handleUpgrade(selectedPlan)}
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    Upgrade to Pro - {formatCurrency(selectedPlanData?.price || 0)}
                    {selectedPlanData?.period === "year" ? "/year" : "/month"}
                  </>
                )}
              </Button>

              <Separator className="my-4" />

              {/* Security & Guarantee */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Secure payment with 256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Cancel anytime, no questions asked</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-2">We accept:</p>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>Credit/Debit Cards</span>
                  <span>•</span>
                  <span>UPI</span>
                  <span>•</span>
                  <span>Net Banking</span>
                  <span>•</span>
                  <span>Wallets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}