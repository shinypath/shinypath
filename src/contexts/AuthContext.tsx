import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { checkAdminSession, setAdminSession, DEMO_ADMIN } from '@/lib/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = checkAdminSession();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      setAdminSession(true);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const signOut = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
