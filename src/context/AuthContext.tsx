import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/data/types';
import { authApi, api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        api.setToken(token);
      } catch (err) {
        console.error('Failed to restore session:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authApi.login(email, password);

      if (response.error || !response.data) {
        throw new Error(response.error || response.message || 'Login failed');
      }

      const { token, userId, userName, userRole, isVerified } = response.data as any;

      // Store token
      api.setToken(token);
      localStorage.setItem('authToken', token);

      // Create user object and store it
      const userData: User = {
        id: userId,
        name: userName,
        email: email,
        role: userRole as any,
        verified: isVerified,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      role: string,
      phone?: string
    ) => {
      try {
        setError(null);
        setLoading(true);

        const response = await authApi.register(email, password, firstName, lastName, role, phone);

        if (response.error || !response.data) {
          throw new Error(response.error || response.message || 'Registration failed');
        }

        // Auto-login after registration
        await login(email, password);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  const logout = useCallback(() => {
    setUser(null);
    api.clearToken();
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    authApi.logout();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
