import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, OnlineStatus } from '@/data/types';
import { useAuth } from './AuthContext';

interface OnlineStatusContextType {
  userStatuses: Record<string, { status: OnlineStatus; lastSeen: string }>;
  updateUserStatus: (userId: string, status: OnlineStatus) => void;
  isUserOnline: (userId: string) => boolean;
  getLastSeen: (userId: string) => string | undefined;
  activateUser: () => void;
  deactivateUser: () => void;
}

const OnlineStatusContext = createContext<OnlineStatusContextType | undefined>(undefined);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userStatuses, setUserStatuses] = useState<Record<string, { status: OnlineStatus; lastSeen: string }>>({});
  const [isActive, setIsActive] = useState(true);

  // Initialize statuses from mock users
  useEffect(() => {
    const initializeStatuses = async () => {
      const response = await import('@/data/mockData');
      const statuses: Record<string, { status: OnlineStatus; lastSeen: string }> = {};
      response.mockUsers.forEach((u: User) => {
        statuses[u.id] = {
          status: u.status || 'offline',
          lastSeen: u.lastSeen || new Date().toISOString(),
        };
      });
      setUserStatuses(statuses);
    };
    initializeStatuses();
  }, []);

  const updateUserStatus = useCallback((userId: string, status: OnlineStatus) => {
    setUserStatuses((prev) => ({
      ...prev,
      [userId]: {
        status,
        lastSeen: new Date().toISOString(),
      },
    }));
  }, []);

  const isUserOnline = useCallback((userId: string) => {
    return userStatuses[userId]?.status === 'online';
  }, [userStatuses]);

  const getLastSeen = useCallback((userId: string) => {
    return userStatuses[userId]?.lastSeen;
  }, [userStatuses]);

  const activateUser = useCallback(() => {
    setIsActive(true);
    if (user) {
      updateUserStatus(user.id, 'online');
    }
  }, [user, updateUserStatus]);

  const deactivateUser = useCallback(() => {
    setIsActive(false);
    if (user) {
      updateUserStatus(user.id, 'away');
    }
  }, [user, updateUserStatus]);

  // Track user activity
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      if (!isActive) {
        activateUser();
      }
    };

    const handleInactivity = () => {
      if (isActive) {
        deactivateUser();
      }
    };

    // Set user as online when component mounts
    updateUserStatus(user.id, 'online');

    // Listen for user activity
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('click', handleActivity);

    // Set timeout for inactivity (15 minutes)
    const inactivityTimeout = setTimeout(() => {
      if (isActive) {
        handleInactivity();
      }
    }, 15 * 60 * 1000);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('click', handleActivity);
      clearTimeout(inactivityTimeout);
    };
  }, [user, isActive, activateUser, deactivateUser, updateUserStatus]);

  return (
    <OnlineStatusContext.Provider
      value={{
        userStatuses,
        updateUserStatus,
        isUserOnline,
        getLastSeen,
        activateUser,
        deactivateUser,
      }}
    >
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  const context = useContext(OnlineStatusContext);
  if (!context) {
    throw new Error('useOnlineStatus must be used within OnlineStatusProvider');
  }
  return context;
}
