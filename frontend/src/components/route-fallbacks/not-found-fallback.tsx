"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileX, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface NotFoundFallbackProps {
  title?: string;
  description?: string;
  showSearch?: boolean;
  className?: string;
}

export function NotFoundFallback({ 
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  showSearch = true,
  className
}: NotFoundFallbackProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <FileX className="h-8 w-8 text-gray-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Error 404
            </Badge>
            <p className="text-sm text-gray-600">
              Double-check the URL or try navigating from the main menu.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleGoBack} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            {showSearch && (
              <Button variant="outline" asChild className="w-full">
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Link>
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Still can't find what you're looking for? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
