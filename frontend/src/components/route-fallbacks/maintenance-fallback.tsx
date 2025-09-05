"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, RefreshCw, Clock, Mail } from "lucide-react";
import Link from "next/link";

interface MaintenanceFallbackProps {
  title?: string;
  description?: string;
  estimatedTime?: string;
  className?: string;
}

export function MaintenanceFallback({ 
  title = "Under Maintenance",
  description = "We're currently performing scheduled maintenance to improve your experience.",
  estimatedTime = "30 minutes",
  className
}: MaintenanceFallbackProps) {
  return (
    <div className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Wrench className="h-8 w-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              <Clock className="mr-1 h-3 w-3" />
              Estimated Time: {estimatedTime}
            </Badge>
            <p className="text-sm text-gray-600">
              We apologize for any inconvenience. Please check back soon.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-800 mb-2">What's happening?</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• System updates and improvements</li>
              <li>• Database optimization</li>
              <li>• Security enhancements</li>
              <li>• Performance improvements</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Go to Homepage
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need immediate assistance? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
