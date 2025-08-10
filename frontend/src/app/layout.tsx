import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MSMEBazaar - Empowering MSMEs with Comprehensive Business Solutions",
  description:
    "Complete business ecosystem for MSMEs including loans, valuation, exit strategies, market linkage, and networking opportunities.",
  keywords: "MSME, business loans, valuation, exit strategy, market linkage, networking",
  authors: [{ name: "MSMEBazaar Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "MSMEBazaar - Empowering MSMEs",
    description: "Complete business ecosystem for MSMEs",
    type: "website",
    locale: "en_IN",
  },
    generator: 'v0.dev'
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * Root layout component that wraps the entire application
 * Provides global providers, theme, and error boundaries
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <QueryProvider>
              <AuthProvider>
                <div className="min-h-screen bg-background font-sans antialiased">{children}</div>
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}