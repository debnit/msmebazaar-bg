'use client';
import { useEffect, useState } from 'react';
import { api } from '@/services/api-client';

interface ChatSession {
  id: string;
  sellerName: string;
  lastMessage: string;
  updatedAt: string;
}

export default function DirectChatList() {
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.messaging.getInvestorChats();
        if (res.success && res.data) {
          setChats(res.data);
        } else {
          setError(res.message || 'Failed to fetch chats');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, []);

  if (loading) return <p>Loading chats...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;
  if (chats.length === 0) return <p>No active chats available.</p>;

  return (
    <ul>
      {chats.map(chat => (
        <li key={chat.id} className='border p-3 rounded mb-2'>
          <strong>{chat.sellerName}</strong> - {chat.lastMessage} - {new Date(chat.updatedAt).toLocaleDateString()}
        </li>
      ))}
    </ul>
  );
}
