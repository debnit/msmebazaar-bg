"use client";

import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingFallbackProps {
  type?: "page" | "component" | "skeleton";
  message?: string;
  showSkeleton?: boolean;
}

export function LoadingFallback({ 
  type = "page", 
  message = "Loading...",
  showSkeleton = false
}: LoadingFallbackProps) {
  if (showSkeleton) {
    return <SkeletonFallback />;
  }

  if (type === "component") {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner size="sm" text={message} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <LoadingSpinner size="lg" text={message} />
        </CardContent>
      </Card>
    </div>
  );
}

function SkeletonFallback() {
  return (
    <div className="space-y-6 p-6">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
