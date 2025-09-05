"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowRight, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

interface AccessDeniedPromptProps {
  reason: "unauthenticated" | "user_not_found" | "session_expired" | "insufficient_permissions";
  className?: string;
}

export function AccessDeniedPrompt({ reason, className }: AccessDeniedPromptProps) {
  const reasonConfig = {
    unauthenticated: {
      title: "Authentication Required",
      description: "Please sign in to access this feature",
      icon: Lock,
      primaryAction: { label: "Sign In", href: "/login", icon: LogIn },
      secondaryAction: { label: "Create Account", href: "/register", icon: UserPlus }
    },
    user_not_found: {
      title: "User Not Found",
      description: "Your account could not be found. Please sign in again",
      icon: Lock,
      primaryAction: { label: "Sign In", href: "/login", icon: LogIn },
      secondaryAction: { label: "Create Account", href: "/register", icon: UserPlus }
    },
    session_expired: {
      title: "Session Expired",
      description: "Your session has expired. Please sign in again",
      icon: Lock,
      primaryAction: { label: "Sign In", href: "/login", icon: LogIn },
      secondaryAction: { label: "Go Home", href: "/", icon: ArrowRight }
    },
    insufficient_permissions: {
      title: "Access Denied",
      description: "You don't have permission to access this feature",
      icon: Lock,
      primaryAction: { label: "Go to Dashboard", href: "/dashboard", icon: ArrowRight },
      secondaryAction: { label: "Contact Support", href: "/contact", icon: ArrowRight }
    }
  };

  const config = reasonConfig[reason];
  const Icon = config.icon;
  const PrimaryIcon = config.primaryAction.icon;
  const SecondaryIcon = config.secondaryAction.icon;

  return (
    <div className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Icon className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
          <CardDescription className="text-lg">
            {config.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Error Code: {reason.toUpperCase()}
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href={config.primaryAction.href}>
                <PrimaryIcon className="mr-2 h-4 w-4" />
                {config.primaryAction.label}
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href={config.secondaryAction.href}>
                <SecondaryIcon className="mr-2 h-4 w-4" />
                {config.secondaryAction.label}
              </Link>
            </Button>
          </div>

          {reason === "unauthenticated" && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Sign up for free</Link>
              </p>
            </div>
          )}

          {reason === "insufficient_permissions" && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need access? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
