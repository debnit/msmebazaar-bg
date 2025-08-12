'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.user.getProfile();
        if (res.success && res.data) {
          setUsers(res.data.users);
        } else {
          setError(res.message || 'Failed to fetch users');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
    <table className='min-w-full border-collapse border'>
      <thead>
        <tr>
          <th className='border p-2'>Name</th>
          <th className='border p-2'>Email</th>
          <th className='border p-2'>Role</th>
          <th className='border p-2'>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id} className='border'>
            <td className='border p-2'>{user.name}</td>
            <td className='border p-2'>{user.email}</td>
            <td className='border p-2'>{user.role}</td>
            <td className='border p-2'>{user.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
