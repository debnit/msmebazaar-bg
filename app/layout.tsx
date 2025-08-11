import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/providers/query-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { StoreProvider } from '@/providers/store-provider'
import { AnalyticsTracker } from '@/components/analytics-tracker'
import './globals.css'

export const metadata: Metadata = {
  title: 'MSMEBazaar - Empowering MSMEs with Digital Solutions',
  description: 'Complete digital platform for MSMEs offering business loans, valuation, market linkage, and growth services',
  keywords: 'MSME, business loans, market linkage, business valuation, startup funding, SME growth',
  authors: [{ name: 'MSMEBazaar Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'MSMEBazaar - Empowering MSMEs',
    description: 'Complete digital platform for MSME growth and funding',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        <StoreProvider>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                <AnalyticsTracker>
                  <div className="relative flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                  </div>
                  <Toaster />
                </AnalyticsTracker>
              </ThemeProvider>
            </AuthProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
