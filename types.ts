export type Page = 'landing' | 'generator' | 'credits' | 'contact' | 'login' | 'signup' | 'purchase' | 'history' | 'admin-users' | 'admin-payments' | 'admin-settings';

export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role?: 'admin' | 'user';
}

export type Theme = 'light' | 'dark';

export interface Resolution {
  label: string;
  value: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  amount: number;
  transactionId: string;
  date: string; // ISO string
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // ISO string
}