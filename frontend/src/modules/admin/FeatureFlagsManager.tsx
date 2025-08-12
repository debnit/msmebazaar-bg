'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface FeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
}

export default function FeatureFlagsManager() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFlags() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.admin.getFeatures();
        if (res.success && res.data) {
          setFlags(res.data);
        } else {
          setError(res.message || 'Failed to fetch feature flags');
        }
      } catch (e: any) {
        setError(e.message || 'Failed to fetch feature flags');
      } finally {
        setLoading(false);
      }
    }
    fetchFlags();
  }, []);

  const toggleFlag = async (id: string, enabled: boolean) => {
    try {
      await api.admin.updateFeature(id, { enabled });
      setFlags(flags.map(f => (f.id === id ? { ...f, enabled } : f)));
    } catch { /* handle error if needed */ }
  };

  if (loading) return <p>Loading feature flags...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;
  if (flags.length === 0) return <p>No feature flags found.</p>;

  return (
    <ul>
      {flags.map(flag => (
        <li key={flag.id} className='flex items-center justify-between border p-2 mb-1 rounded'>
          <div>{flag.name}</div>
          <input
            type='checkbox'
            checked={flag.enabled}
            onChange={e => toggleFlag(flag.id, e.target.checked)}
          />
        </li>
      ))}
    </ul>
  );
}
