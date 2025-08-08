'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Send } from 'lucide-react'
import Link from "next/link"

interface FormData {
  name: string
  businessName: string
  phone: string
  email: string
  message: string
}

export function EnquiryForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you would send the data to your backend
      console.log('Form submitted:', formData)
      
      // Show success toast
      toast({
        title: "Enquiry Submitted Successfully! ✅",
        description: "Thank you for your interest. Our team will contact you within 24 hours.",
        duration: 5000,
      })

      // Reset form
      setFormData({
        name: '',
        businessName: '',
        phone: '',
        email: '',
        message: ''
      })

    } catch (error) {
      // Show error toast
      toast({
        title: "Submission Failed ❌",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.phone && formData.email && formData.message

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            placeholder="Enter your business name"
            value={formData.businessName}
            onChange={handleInputChange}
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="h-11"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your business needs, loan requirements, or any questions you have..."
          value={formData.message}
          onChange={handleInputChange}
          required
          className="min-h-[120px] resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          type="submit" 
          disabled={!isFormValid || isSubmitting}
          className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Enquiry
            </>
          )}
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 sm:flex-none h-12"
          onClick={() => {
            const message = encodeURIComponent("Hi, I need help on MSMEBazaar.")
            const whatsappUrl = `https://wa.me/919999999999?text=${message}`
            window.open(whatsappUrl, '_blank')
          }}
        >
          💬 WhatsApp Us
        </Button>
      </div>

      <div className="text-center text-sm text-gray-600">
        <p>
          By submitting this form, you agree to our{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </form>
  )
}
