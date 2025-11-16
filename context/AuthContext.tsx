import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, PaymentRequest, UserTier } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  submitPaymentRequest: (request: Omit<PaymentRequest, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => void;
  getPaymentHistoryForUser: () => PaymentRequest[];

  // Admin
  getAllUsers: () => User[];
  updateUserCredits: (userId: string, newCredits: number) => void;
  deleteUser: (userId: string) => void;
  getAllPaymentRequests: () => PaymentRequest[];
  approvePaymentRequest: (paymentId: string) => void;
  rejectPaymentRequest: (paymentId: string) => void;
  getDisplayApiKey: () => { key: string, isSet: boolean, isOverride: boolean };
  updateApiKey: (newKey: string) => void;
  removeApiKey: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [apiKeyOverride, setApiKeyOverride] = useState<string | null>(() => localStorage.getItem('imagerAiApiKeyOverride'));

  useEffect(() => {
    const storedUser = localStorage.getItem('imagerAiUser');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (!parsedUser.tier) { // Backward compatibility
            parsedUser.tier = 'Free';
        }
        setUser(parsedUser);
    }
    
    const storedUsers = localStorage.getItem('imagerAiUsers');
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedPayments = localStorage.getItem('imagerAiPayments');
    if (storedPayments) setPayments(JSON.parse(storedPayments));
  }, []);

  const persistCurrentUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem('imagerAiUser', JSON.stringify(userData));
    } else {
      localStorage.removeItem('imagerAiUser');
    }
    setUser(userData);
  };
  
  const persistAllUsers = (allUsers: Record<string, User>) => {
    localStorage.setItem('imagerAiUsers', JSON.stringify(allUsers));
    setUsers(allUsers);
  };
  
  const persistPayments = (allPayments: PaymentRequest[]) => {
      localStorage.setItem('imagerAiPayments', JSON.stringify(allPayments));
      setPayments(allPayments);
  };

  const login = useCallback((email: string, password?: string) => {
    if (email === 'askservicesbyme@gmail.com' && password === 'Ahmadraza161259a@!') {
      const adminUser: User = {
        id: 'admin_user',
        name: 'Admin',
        email: email,
        credits: 99999,
        role: 'admin',
        tier: 'Pro',
      };
      persistCurrentUser(adminUser);
      return;
    }

    if (users[email]) {
      const existingUser = users[email];
      if (!existingUser.tier) existingUser.tier = 'Free';
      persistCurrentUser(existingUser);
    } else {
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            credits: 40,
            role: 'user',
            tier: 'Free',
        };
        const updatedUsers = { ...users, [email]: newUser };
        persistAllUsers(updatedUsers);
        persistCurrentUser(newUser);
    }
  }, [users]);

  const signup = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      credits: 40,
      role: 'user',
      tier: 'Free',
    };
    const updatedUsers = { ...users, [email]: newUser };
    persistAllUsers(updatedUsers);
    persistCurrentUser(newUser);
  }, [users]);

  const logout = useCallback(() => {
    persistCurrentUser(null);
  }, []);

  const updateUserState = (updatedUser: User) => {
    persistCurrentUser(updatedUser);
    const allUsers = { ...users, [updatedUser.email]: updatedUser };
    persistAllUsers(allUsers);
  }

  const deductCredits = useCallback((amount: number) => {
    if (user && user.credits >= amount) {
      const updatedUser = { ...user, credits: user.credits - amount };
      updateUserState(updatedUser);
      return true;
    }
    return false;
  }, [user, users]);

  const addCredits = useCallback((amount: number) => {
    if(user) {
        const updatedUser = { ...user, credits: user.credits + amount };
        updateUserState(updatedUser);
    }
  }, [user, users]);

  const submitPaymentRequest = useCallback((requestData: Omit<PaymentRequest, 'id' | 'userId' | 'userName' | 'userEmail' | 'status' | 'createdAt'>) => {
      if (!user) return;
      const newRequest: PaymentRequest = {
          ...requestData,
          id: `payment_${Date.now()}`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          status: 'pending',
          createdAt: new Date().toISOString(),
      };
      persistPayments([...payments, newRequest]);
  }, [user, payments]);

  const getPaymentHistoryForUser = useCallback(() => {
    if (!user) return [];
    return payments.filter(p => p.userId === user.id).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user, payments]);

  const getAllUsers = useCallback(() => {
    const userList: User[] = [];
    if (users && typeof users === 'object') {
      for (const email in users) {
        const currentUser = users[email];
        if (currentUser && currentUser.role !== 'admin') {
          if (!currentUser.tier) currentUser.tier = 'Free'; // Backward compatibility
          userList.push(currentUser);
        }
      }
    }
    return userList;
  }, [users]);
  
  const updateUserCredits = useCallback((userId: string, newCredits: number) => {
    let userToUpdate: User | null = null;
    if (users && typeof users === 'object') {
      for (const email in users) {
        if (users[email].id === userId) {
          userToUpdate = users[email];
          break;
        }
      }
    }
    
    if (userToUpdate) {
        const updatedUser = { ...userToUpdate, credits: newCredits };
        const updatedUsers = { ...users, [userToUpdate.email]: updatedUser };
        persistAllUsers(updatedUsers);
    }
  }, [users]);

  const deleteUser = useCallback((userId: string) => {
    let userToDelete: User | null = null;
    if (users && typeof users === 'object') {
      for (const email in users) {
        if (users[email].id === userId) {
          userToDelete = users[email];
          break;
        }
      }
    }
    
    if(userToDelete) {
        const { [userToDelete.email]: _, ...remainingUsers } = users;
        persistAllUsers(remainingUsers);
        const remainingPayments = payments.filter(p => p.userId !== userId);
        persistPayments(remainingPayments);
    }
  }, [users, payments]);

  const getAllPaymentRequests = useCallback(() => payments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [payments]);

  const approvePaymentRequest = useCallback((paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;

    const userToCredit = users[payment.userEmail];
    if (userToCredit) {
        const creditsToAdd = Number(payment.plan.split(' ')[0]);
        
        let newTier: UserTier = userToCredit.tier || 'Free';
        const tierValues: Record<UserTier, number> = { 'Free': 0, 'Basic': 1, 'Pro': 2 };

        if (payment.plan.includes('120 Credits') && tierValues[newTier] < 1) {
            newTier = 'Basic';
        } else if (payment.plan.includes('280 Credits') && tierValues[newTier] < 2) {
            newTier = 'Pro';
        }
        
        const updatedUser = { 
            ...userToCredit, 
            credits: userToCredit.credits + creditsToAdd,
            tier: newTier
        };
        const updatedUsers = { ...users, [payment.userEmail]: updatedUser };
        persistAllUsers(updatedUsers);

        if (user && user.id === updatedUser.id) {
            persistCurrentUser(updatedUser);
        }
    }

    const updatedPayments = payments.map((p): PaymentRequest => p.id === paymentId ? { ...p, status: 'approved' } : p);
    persistPayments(updatedPayments);

  }, [payments, users, user]);

  const rejectPaymentRequest = useCallback((paymentId: string) => {
      const updatedPayments = payments.map((p): PaymentRequest => p.id === paymentId ? { ...p, status: 'rejected' } : p);
      persistPayments(updatedPayments);
  }, [payments]);

  const getDisplayApiKey = useCallback(() => {
    const overrideKey = apiKeyOverride;
    const isSet = !!overrideKey && overrideKey.length > 0;
    const isOverride = isSet; // Any configured key is an override

    const mask = (key: string) => {
        if (key.length > 8) {
            return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
        }
        return 'Key is too short to mask';
    }

    return { key: isSet ? mask(overrideKey!) : 'Not Configured', isSet, isOverride };
  }, [apiKeyOverride]);

  const updateApiKey = useCallback((newKey: string) => {
      localStorage.setItem('imagerAiApiKeyOverride', newKey);
      setApiKeyOverride(newKey);
  }, []);

  const removeApiKey = useCallback(() => {
      localStorage.removeItem('imagerAiApiKeyOverride');
      setApiKeyOverride(null);
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    deductCredits,
    addCredits,
    submitPaymentRequest,
    getPaymentHistoryForUser,
    getAllUsers,
    updateUserCredits,
    deleteUser,
    getAllPaymentRequests,
    approvePaymentRequest,
    rejectPaymentRequest,
    getDisplayApiKey,
    updateApiKey,
    removeApiKey,
  }), [user, users, payments, login, signup, logout, deductCredits, addCredits, getAllUsers, updateUserCredits, deleteUser, getDisplayApiKey, updateApiKey, removeApiKey]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};