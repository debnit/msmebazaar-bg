'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';
import type { Product } from '@/types/marketplace';

export default function SellerProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.marketplace.getProducts({ owner: 'me' });
        if (res.success && res.data) {
          setProducts(res.data);
        } else {
          setError(res.message || 'Failed to load products');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;

  if (products.length === 0) return <p>No products found.</p>;

  return (
    <table className='min-w-full border-collapse border'>
      <thead>
        <tr>
          <th className='border p-2'>Name</th>
          <th className='border p-2'>Price</th>
          <th className='border p-2'>Status</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product.id} className='border'>
            <td className='border p-2'>{product.name}</td>
            <td className='border p-2'>₹{product.price}</td>
            <td className='border p-2 capitalize'>{product.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
