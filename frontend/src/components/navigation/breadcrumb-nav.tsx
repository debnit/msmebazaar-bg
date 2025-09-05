"use client";

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useBreadcrumbs } from '@/contexts/navigation-context';
import { cn } from '@/lib/utils';

interface BreadcrumbNavProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
}

export function BreadcrumbNav({ 
  className, 
  showHome = true, 
  maxItems = 5 
}: BreadcrumbNavProps) {
  const breadcrumbs = useBreadcrumbs();
  
  // Limit breadcrumbs if too many
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0], // Home
        { label: '...', href: '#' },
        ...breadcrumbs.slice(-(maxItems - 2))
      ]
    : breadcrumbs;

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-gray-600", className)}>
      {displayBreadcrumbs.map((crumb, index) => {
        const isLast = index === displayBreadcrumbs.length - 1;
        const isHome = crumb.href === '/';
        
        return (
          <div key={crumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            )}
            
            {isLast ? (
              <span className="text-gray-900 font-medium">
                {isHome && showHome ? (
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {crumb.label}
                  </div>
                ) : (
                  crumb.label
                )}
              </span>
            ) : (
              <Link 
                href={crumb.href}
                className="hover:text-blue-600 transition-colors flex items-center"
              >
                {isHome && showHome ? (
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {crumb.label}
                  </div>
                ) : (
                  crumb.label
                )}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
