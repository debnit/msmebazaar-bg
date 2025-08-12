'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api-client';
import { useAuthStore } from '@/store/auth.store';

export default function LogoutPage() {
  const router = useRouter();
  const { clearAuth } = useAuthStore();

  useEffect(() => {
    const doLogout = async () => {
      await api.auth.logout();
      clearAuth();
      router.replace('/');
    };
    doLogout();
  }, [router, clearAuth]);

  return <p className="text-center mt-10">Logging out...</p>;
}
