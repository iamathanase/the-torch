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
  updateUserProfile: (updates: Partial<User>) => void;
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
    
    console.log('AuthContext: Initializing...');
    console.log('AuthContext: Token exists:', !!token);
    console.log('AuthContext: UserData exists:', !!userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Loaded user from localStorage:', {
          id: parsedUser.id,
          name: parsedUser.name,
          avatar: parsedUser.avatar,
          hasAvatar: !!parsedUser.avatar
        });
        setUser(parsedUser);
        api.setToken(token);
      } catch (err) {
        console.error('AuthContext: Failed to restore session:', err);
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

      // Fetch full user profile to get profile picture
      try {
        const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'https://thetorchbackend.vercel.app/api'}/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          const fullUserData = profileData.data;
          
          // Create user object with profile picture
          const userData: User = {
            id: userId,
            name: `${fullUserData.firstName} ${fullUserData.lastName}`,
            email: fullUserData.email,
            role: userRole as any,
            verified: isVerified,
            avatar: fullUserData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
            coverImage: fullUserData.coverImage,
            bio: fullUserData.bio,
            createdAt: fullUserData.createdAt || new Date().toISOString(),
          };

          localStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        } else {
          // Fallback if profile fetch fails
          const userData: User = {
            id: userId,
            name: userName,
            email: email,
            role: userRole as any,
            verified: isVerified,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
            createdAt: new Date().toISOString(),
          };

          localStorage.setItem('userData', JSON.stringify(userData));
          setUser(userData);
        }
      } catch (profileErr) {
        console.error('Failed to fetch profile:', profileErr);
        // Fallback user data
        const userData: User = {
          id: userId,
          name: userName,
          email: email,
          role: userRole as any,
          verified: isVerified,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`,
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
      }
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

  const updateUserProfile = useCallback((updates: Partial<User>) => {
    console.log('AuthContext: updateUserProfile called with:', updates);
    setUser(prev => {
      if (!prev) {
        console.log('AuthContext: No previous user, skipping update');
        return prev;
      }
      const updated = { ...prev, ...updates };
      console.log('AuthContext: Updated user:', {
        id: updated.id,
        name: updated.name,
        avatar: updated.avatar,
        hasAvatar: !!updated.avatar
      });
      localStorage.setItem('userData', JSON.stringify(updated));
      console.log('AuthContext: Saved to localStorage');
      return updated;
    });
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
        updateUserProfile,
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
