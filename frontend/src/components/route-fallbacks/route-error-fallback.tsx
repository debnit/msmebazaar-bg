"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RouteErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export function RouteErrorFallback({ error, resetError }: RouteErrorFallbackProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Something went wrong</CardTitle>
          <CardDescription className="text-lg">
            We're sorry, but something unexpected happened on this page.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Page Error
            </Badge>
            <p className="text-sm text-gray-600">
              This error has been logged and our team will investigate.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800 mb-2">Error Details:</p>
              <p className="text-xs text-red-700 font-mono break-all">{error.message}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button onClick={resetError} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" onClick={handleGoBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Still having issues? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
