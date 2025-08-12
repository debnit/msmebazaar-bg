'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface BusinessMetrics {
  totalSales: number;
  activeListings: number;
  featuredBoostCount: number;
}

export default function SellerAnalytics() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.analytics.getBusinessMetrics();
        if (res.success && res.data) setMetrics(res.data);
        else setError(res.message || 'Failed to fetch analytics');
      } catch (e: any) {
        setError(e.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
  }, []);

  if (loading) return <p>Loading analytics...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;

  if (!metrics) return <p>No analytics data available.</p>;

  return (
    <div>
      <h3 className='font-semibold mb-2'>Business Metrics</h3>
      <ul>
        <li>Total Sales: ₹{metrics.totalSales}</li>
        <li>Active Listings: {metrics.activeListings}</li>
        <li>Featured Boosts: {metrics.featuredBoostCount}</li>
      </ul>
    </div>
  );
}
