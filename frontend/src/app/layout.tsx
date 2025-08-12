cd frontendimport type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/error-boundary"

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
  generator: "MSMEBazaar",
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
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <QueryProvider>
              <AuthProvider>
                <div className="relative flex min-h-screen flex-col">
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}