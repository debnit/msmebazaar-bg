// Notification related types
export interface Notification {
  id: string;
  userId: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  category: 'SYSTEM' | 'PAYMENT' | 'LOAN' | 'BUSINESS' | 'MARKETING';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  actionUrl?: string;
  actionText?: string;
  expiresAt?: Date;
  createdAt: Date;
}

export interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    system: boolean;
    payment: boolean;
    loan: boolean;
    business: boolean;
    marketing: boolean;
  };
  updatedAt: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'EMAIL' | 'PUSH' | 'SMS';
  category: string;
  subject?: string;
  body: string;
  variables: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
