export interface User {
  id: string;
  email: string;
  name: string;
  isPro: boolean;
  roles: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  phone?: string;
  avatarUrl?: string;
}
