"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

interface UpgradePromptProps {
  feature?: string;
  className?: string;
}

export function UpgradePrompt({ feature = "premium_feature", className }: UpgradePromptProps) {
  const featureBenefits = {
    buyer_pro: [
      "Unlimited seller contacts",
      "Advanced search filters", 
      "Saved searches",
      "Priority support",
      "Advanced analytics"
    ],
    seller_pro: [
      "Unlimited listings",
      "Featured listing boost",
      "Advanced analytics",
      "Priority support",
      "Custom branding"
    ],
    agent_pro: [
      "CRM dashboard",
      "Unlimited deals",
      "Higher commission rates",
      "Priority support",
      "Advanced reporting"
    ],
    investor_pro: [
      "Early access opportunities",
      "Direct MSME chats",
      "Portfolio management",
      "Priority support",
      "Advanced analytics"
    ],
    business_valuation: [
      "AI-powered valuation",
      "Detailed reports",
      "Market comparisons",
      "Export capabilities",
      "Expert consultation"
    ],
    exit_strategy: [
      "Strategic exit planning",
      "Business sale assistance",
      "Market analysis",
      "Legal guidance",
      "Tax optimization"
    ],
    market_linkage: [
      "Verified suppliers",
      "Best rate negotiations",
      "Quality assurance",
      "Logistics support",
      "Payment protection"
    ],
    leadership_training: [
      "Expert-led sessions",
      "Certification programs",
      "Networking events",
      "Mentorship access",
      "Resource library"
    ],
    premium_feature: [
      "Advanced features",
      "Priority support",
      "Enhanced analytics",
      "Custom solutions",
      "Expert guidance"
    ]
  };

  const benefits = featureBenefits[feature as keyof typeof featureBenefits] || featureBenefits.premium_feature;

  return (
    <div className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Crown className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Upgrade to Pro</CardTitle>
          <CardDescription className="text-lg">
            Unlock premium features and take your business to the next level
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Starting at ₹99/month
            </Badge>
            <p className="text-sm text-gray-600">
              Cancel anytime • 7-day free trial
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">What you'll get:</h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Link href="/onboarding">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/pricing">
                View Pricing
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Already have a Pro account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
