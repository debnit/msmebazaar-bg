'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface BusinessDocument {
  id: string;
  type: string;
  name: string;
  fileUrl: string;
}

export default function OwnerBusinessTools() {
  const [docs, setDocs] = useState<BusinessDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.business.getDocuments();
        if (res.success && res.data) {
          setDocs(res.data);
        } else {
          setError(res.message || 'Failed to fetch business documents');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch business documents');
      } finally {
        setLoading(false);
      }
    }

    fetchDocs();
  }, []);

  if (loading) return <p>Loading business documents...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;
  if (docs.length === 0) return <p>No business documents found.</p>;

  return (
    <ul>
      {docs.map(doc => (
        <li key={doc.id} className='border p-3 rounded mb-2'>
          <a href={doc.fileUrl} target='_blank' rel='noopener noreferrer' className='text-blue-600 underline'>
            {doc.name} ({doc.type})
          </a>
        </li>
      ))}
    </ul>
  );
}
