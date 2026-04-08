/**
 * Global User Store — in-memory singleton for cross-dashboard user management.
 */
import { useState } from 'react';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'vendor' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  phone: string;
  orders: number;
  joinedAt: string;
}

let _globalUsers: StoredUser[] = [];
let _listeners: Array<() => void> = [];

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

export function useUserStore() {
  const [, forceRender] = useState(0);
  const rerender = () => forceRender((n) => n + 1);
  if (!_listeners.includes(rerender)) {
    _listeners.push(rerender);
  }

  return {
    users: _globalUsers,
    addUser: (u: StoredUser) => {
      _globalUsers = [..._globalUsers, u];
      notifyListeners();
    },
    updateUser: (u: StoredUser) => {
      _globalUsers = _globalUsers.map((x) => (x.id === u.id ? u : x));
      notifyListeners();
    },
    deleteUser: (id: string) => {
      _globalUsers = _globalUsers.filter((x) => x.id !== id);
      notifyListeners();
    },
  };
}
