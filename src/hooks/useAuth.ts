import { useState } from 'react';
import { User, Role } from '@/types';

const DEMO_ACCOUNTS = [
  { email: 'customer@festiveretail.com', password: 'customer123', role: 'customer' as Role, name: 'Priya Sharma', id: 'c1', phone: '+91 98765 43210', joinedAt: '2024-01-15' },
  { email: 'vendor@festiveretail.com', password: 'vendor123', role: 'vendor' as Role, name: 'Raj Enterprises', id: 'v1', phone: '+91 87654 32109', joinedAt: '2023-11-20' },
  { email: 'admin@festiveretail.com', password: 'admin123', role: 'admin' as Role, name: 'Admin User', id: 'a1', phone: '+91 76543 21098', joinedAt: '2023-06-01' },
];

export const getDemoAccounts = () => DEMO_ACCOUNTS;

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('festive_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (email: string, password: string): { success: boolean; role?: Role; error?: string } => {
    // Check demo accounts first
    const demo = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
    if (demo) {
      const userData: User = { id: demo.id, name: demo.name, email: demo.email, role: demo.role, phone: demo.phone, joinedAt: demo.joinedAt };
      localStorage.setItem('festive_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, role: demo.role };
    }

    // Check dynamic users from userStore (localStorage snapshot)
    try {
      const storeRaw = localStorage.getItem('festive_user_store');
      if (storeRaw) {
        const stored = JSON.parse(storeRaw) as Array<{ email: string; password: string; role: Role; name: string; id: string; phone: string; joinedAt: string; status: string }>;
        const match = stored.find((u) => u.email === email && u.password === password);
        if (match) {
          if (match.status === 'blocked') return { success: false, error: 'Your account has been blocked. Contact support.' };
          const userData: User = { id: match.id, name: match.name, email: match.email, role: match.role, phone: match.phone, joinedAt: match.joinedAt };
          localStorage.setItem('festive_user', JSON.stringify(userData));
          setUser(userData);
          return { success: true, role: match.role };
        }
      }
    } catch (_) {}

    return { success: false, error: 'Invalid email or password' };
  };

  const logout = () => {
    localStorage.removeItem('festive_user');
    setUser(null);
  };

  const register = (name: string, email: string, password: string, role: Role) => {
    const newUser: User = { id: Date.now().toString(), name, email, role, joinedAt: new Date().toISOString().split('T')[0] };
    localStorage.setItem('festive_user', JSON.stringify(newUser));
    setUser(newUser);
    return { success: true, role };
  };

  return { user, login, logout, register, isAuthenticated: !!user };
}
