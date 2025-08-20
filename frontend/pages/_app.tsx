"use client";

import type { AppProps } from "next/app";
import { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import AnalyticsScripts from "@/components/analytics/AnalyticsScripts";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import Seo from "@/components/seo/Seo"; // Refactored SEO imported

import "@/styles/globals.css";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error: any) => {
          if (
            error?.status >= 400 &&
            error?.status < 500 &&
            ![408, 429].includes(error?.status)
          ) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 1 },
    },
  });

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = useMemo(() => createQueryClient(), []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Head>
        <Seo />
      </Head>

      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <div className="min-h-screen bg-background font-sans antialiased">
                <Component {...pageProps} />

                {/* Global UI */}
                <Toaster />
                <AnalyticsTracker> </ AnalyticsTracker>
                <AnalyticsScripts />

                {/* Devtools in development */}
                {process.env.NODE_ENV === "development" && (
                  <ReactQueryDevtools initialIsOpen={false} />
                )}
              </div>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </>
  );
}
