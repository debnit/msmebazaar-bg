"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ArrowRight, User, Building2, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

interface RoleMismatchPromptProps {
  currentRole?: string;
  allowedRoles: string[];
  className?: string;
}

export function RoleMismatchPrompt({ 
  currentRole = "unknown", 
  allowedRoles, 
  className 
}: RoleMismatchPromptProps) {
  const roleInfo = {
    buyer: { label: "Buyer", icon: User, description: "Browse and connect with MSMEs", path: "/buyer/free" },
    seller: { label: "Seller", icon: Building2, description: "List and sell your MSME", path: "/seller/free" },
    agent: { label: "Agent", icon: Users, description: "Facilitate MSME transactions", path: "/agent/free" },
    investor: { label: "Investor", icon: TrendingUp, description: "Invest in MSME opportunities", path: "/investor/free" },
    admin: { label: "Admin", icon: Shield, description: "Manage platform operations", path: "/admin" },
    superadmin: { label: "Super Admin", icon: Shield, description: "System administration", path: "/superadmin" }
  };

  const currentRoleInfo = roleInfo[currentRole as keyof typeof roleInfo];
  const availableRoles = allowedRoles.map(role => roleInfo[role as keyof typeof roleInfo]).filter(Boolean);

  return (
    <div className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Restricted</CardTitle>
          <CardDescription className="text-lg">
            This area is not available for your current role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Badge variant="outline" className="mb-2">
              Current Role: {currentRoleInfo?.label || currentRole}
            </Badge>
            <p className="text-sm text-gray-600">
              {currentRoleInfo?.description || "You don't have access to this feature"}
            </p>
          </div>

          {availableRoles.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-center">Available for:</h3>
              <div className="grid gap-3">
                {availableRoles.map((role, index) => {
                  const Icon = role.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{role.label}</p>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={role.path}>
                          Access
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/roles">
                Switch Role
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need access to this feature? <Link href="/contact" className="text-blue-600 hover:underline">Contact support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
