"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

interface Props {
  role: string
  proBenefits: string[]
  price: number
}

export function ProUpgradeOnboarding({ role, proBenefits, price }: Props) {
  const handlePayment = async () => {
    // TODO: integrate with payment.api.ts + Razorpay/Stripe
    console.log(`Upgrading ${role} to Pro for ₹${price}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Upgrade to Pro ({role})</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {proBenefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2">
                <CheckCircle className="text-green-600 h-4 w-4" aria-hidden /> {benefit}
              </li>
            ))}
          </ul>
          <div className="text-center mt-6">
            <Button onClick={handlePayment}>
              Pay ₹{price} & Upgrade <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
