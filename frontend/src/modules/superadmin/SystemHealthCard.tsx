'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface SystemHealth {
  uptime: string;
  errorRate: number;
}

export default function SystemHealthCard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHealth() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.superadmin.getSystemHealth();
        if (res.success && res.data) {
          setHealth(res.data);
        } else {
          setError(res.message || 'Failed to fetch system health');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch system health');
      } finally {
        setLoading(false);
      }
    }
    fetchHealth();
  }, []);

  if (loading) return <p>Loading system health...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;
  if (!health) return <p>No system health data available.</p>;

  return (
    <div>
      <p>Server Uptime: {health.uptime}</p>
      <p>Error Rate: {health.errorRate}%</p>
    </div>
  );
}
