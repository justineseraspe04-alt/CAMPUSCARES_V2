import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/authApi';
import {
  normalizeAuthUser,
  normalizeRole,
  STORAGE_KEY,
} from '../utils/authUtils';

export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  role: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: authApi.LoginPayload) => Promise<AuthUser>;
  register: (payload: authApi.RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function userFromAuthResponse(data: {
  userId: number;
  fullName: string;
  email: string;
  role: string;
}): AuthUser {
  const role = normalizeRole(data.role) ?? data.role.toUpperCase();
  return {
    userId: data.userId,
    fullName: data.fullName?.trim() || data.email,
    email: data.email.trim(),
    role,
  };
}

function persistUser(nextUser: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = normalizeAuthUser(JSON.parse(stored));
        if (parsed) {
          setUser(parsed);
          persistUser(parsed);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (payload: authApi.LoginPayload) => {
    const response = await authApi.login(payload);
    if (!response.success) {
      throw new Error(response.message || 'Login failed');
    }
    const nextUser = userFromAuthResponse(response.data);
    setUser(nextUser);
    persistUser(nextUser);
    return nextUser;
  };

  const register = async (payload: authApi.RegisterPayload) => {
    const response = await authApi.register(payload);
    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
    const nextUser = userFromAuthResponse(response.data);
    setUser(nextUser);
    persistUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const role = user?.role ?? null;
  const isAuthenticated = user !== null;

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [user, role, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
}
