"use client";
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
  proOnly?: boolean;
}

export default function RoleGuard({ allowedRoles, children, proOnly }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!user?.primaryRole || !allowedRoles.includes(user.primaryRole)) {
      router.replace('/dashboard');
      return;
    }
    if (proOnly && !user?.isPro) {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, user, allowedRoles, proOnly, router]);

  return <>{children}</>;
}
