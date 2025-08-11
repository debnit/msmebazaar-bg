import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, TrendingUp, DollarSign, Users, Star, CheckCircle, Phone, Mail, MapPin, ArrowRight, Shield, Clock, Award, MessageCircle } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { EnquiryForm } from "@/components/enquiry-form"

export default function MSMEBazaarLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">MSMEBazaar</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#features">
            Services
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#testimonials">
            Reviews
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors" href="#contact">
            Contact
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    Trusted by 10,000+ MSMEs
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Grow Your MSME with{" "}
                    <span className="text-blue-600">Expert Solutions</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Get loans, valuations, exit strategies, and market linkages all in one platform. 
                    Start your growth journey for just ₹99.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Get Started for ₹99
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    No hidden fees
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Expert guidance
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Quick setup
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/modern-business-dashboard.png"
                  width={600}
                  height={400}
                  alt="MSMEBazaar Dashboard"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Complete MSME Solutions
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything your business needs to grow, scale, and succeed in one integrated platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle>Business Loans</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Access quick and affordable business loans with minimal documentation. 
                    Get funding for expansion, inventory, or working capital needs.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Loans up to ₹50 lakhs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Quick approval process
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Competitive interest rates
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle>Business Valuation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Get accurate business valuations for investment, sale, or strategic planning. 
                    Professional reports by certified valuers.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certified valuation reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Multiple valuation methods
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Investment-ready documents
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <CardTitle>Exit Strategy</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Plan your business exit with expert guidance. Whether selling to competitors, 
                    investors, or going public, we help maximize your returns.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Strategic exit planning
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Buyer identification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Deal negotiation support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <CardTitle>Market Linkage</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Connect with suppliers, distributors, and customers. Expand your market reach 
                    through our extensive business network.
                  </CardDescription>
                  <ul className="mt-4 space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Verified business partners
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Market expansion support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      B2B networking events
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  What Our Clients Say
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of successful MSMEs who have grown their businesses with us.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm">
                    "MSMEBazaar helped us secure a ₹25 lakh loan in just 2 weeks. The process was smooth 
                    and transparent. Highly recommended for any MSME looking for quick funding."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Rajesh Kumar</div>
                    <div className="text-sm text-gray-600">Founder, Kumar Textiles</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm">
                    "The business valuation service was exceptional. We got a detailed report that helped 
                    us attract investors and raise ₹1 crore in Series A funding."
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-sm text-gray-600">CEO, TechStart Solutions</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm">
                    "Through their market linkage program, we connected with 5 new distributors and 
                    increased our sales by 40% in 6 months. Amazing platform!"
                  </blockquote>
                  <div className="mt-4">
                    <div className="font-semibold">Amit Patel</div>
                    <div className="text-sm text-gray-600">Director, Patel Manufacturing</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Start Your Growth Journey
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get access to all our services with our affordable onboarding plan.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-2xl py-12">
              <Card className="relative overflow-hidden border-2 border-blue-200 shadow-lg">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                </div>
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">MSME Onboarding Plan</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">₹99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <CardDescription className="text-base mt-2">
                    Everything you need to get started and grow your MSME
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Business profile setup and verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Access to loan application portal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Basic business valuation report</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Market linkage directory access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Monthly business consultation call</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>24/7 customer support</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      Get Started Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600 pt-2">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Secure payments
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Cancel anytime
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                  Ready to Grow Your Business?
                </h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of successful MSMEs. Start your growth journey today for just ₹99.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Enquiry Form Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Have Questions? Let's Talk!
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our MSME experts are here to help you grow your business. Send us your enquiry and we'll get back to you within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Send us an Enquiry</CardTitle>
                  <CardDescription className="text-center">
                    Fill out the form below and our team will contact you soon
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EnquiryForm />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold">MSMEBazaar</span>
              </div>
              <p className="text-sm text-gray-600">
                Empowering MSMEs with comprehensive business solutions for growth and success.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Services</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Business Loans</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Valuation</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Exit Strategy</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Market Linkage</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Company</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-600 hover:text-blue-600">About Us</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Careers</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Blog</Link>
                <Link href="#" className="block text-gray-600 hover:text-blue-600">Press</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Support & Contact</h4>
              <div className="space-y-2 text-sm">
                <Link href="mailto:support@msmebazaar.in" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Mail className="h-4 w-4" />
                  support@msmebazaar.in
                </Link>
                <Link href="tel:+919999999999" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <Phone className="h-4 w-4" />
                  +91 99999 99999
                </Link>
                <Link href="#" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                  <MapPin className="h-4 w-4" />
                  Mumbai, India
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open('https://calendly.com/msmebazaar', '_blank')}
                >
                  📅 Schedule a Call
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center border-t mt-8">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} MSMEBazaar. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
              <Link className="text-xs hover:underline underline-offset-4 text-gray-600" href="#">
                Terms of Service
              </Link>
              <Link className="text-xs hover:underline underline-offset-4 text-gray-600" href="#">
                Privacy Policy
              </Link>
              <Link className="text-xs hover:underline underline-offset-4 text-blue-600 font-medium" href="mailto:support@msmebazaar.com">
                Support
              </Link>
            </nav>
          </div>
        </div>
      </footer>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          size="lg" 
          className="rounded-full bg-green-500 hover:bg-green-600 shadow-lg h-14 w-14 p-0 animate-bounce"
          onClick={() => {
            const message = encodeURIComponent("Hi, I need help on MSMEBazaar.")
            const whatsappUrl = `https://wa.me/919999999999?text=${message}`
            window.open(whatsappUrl, '_blank')
          }}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}