"use client"

import type { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { useState, useEffect } from "react"
import Head from "next/head"
import "@/styles/globals.css"

// Create a client
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors except 408, 429
          if (error?.status >= 400 && error?.status < 500 && ![408, 429].includes(error?.status)) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  })

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => createQueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>MSMEBazaar - Empowering Indian MSMEs</title>
        <meta
          name="description"
          content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msmebazaar.com/" />
        <meta property="og:title" content="MSMEBazaar - Empowering Indian MSMEs" />
        <meta
          property="og:description"
          content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
        />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://msmebazaar.com/" />
        <meta property="twitter:title" content="MSMEBazaar - Empowering Indian MSMEs" />
        <meta
          property="twitter:description"
          content="India's leading platform for Micro, Small & Medium Enterprises. Connect, grow, and scale your business with MSMEBazaar."
        />
        <meta property="twitter:image" content="/og-image.jpg" />

        {/* Additional SEO */}
        <meta
          name="keywords"
          content="MSME, Small Business, Indian Business, B2B Marketplace, Business Loans, GST, Udyam Registration"
        />
        <meta name="author" content="MSMEBazaar" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://msmebazaar.com/" />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Component {...pageProps} />

                {/* Global Components */}
                <Toaster />
                <AnalyticsTracker />

                {/* Development Tools */}
                {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
              </div>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>

      {/* Global Scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Prevent FOUC (Flash of Unstyled Content)
            (function() {
              try {
                var theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />

      {/* Analytics Scripts */}
      {process.env.NODE_ENV === "production" && (
        <>
          {/* Google Analytics */}
          {process.env.NEXT_PUBLIC_GA_ID && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                      page_title: document.title,
                      page_location: window.location.href,
                    });
                  `,
                }}
              />
            </>
          )}

          {/* Hotjar */}
          {process.env.NEXT_PUBLIC_HOTJAR_ID && (
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                `,
              }}
            />
          )}
        </>
      )}
    </>
  )
}