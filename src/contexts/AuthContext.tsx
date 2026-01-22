import React, { createContext, useContext, ReactNode } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  } = useSupabaseAuth();

  const isAuthenticated = !!user && !!session;

  return (
    <AuthContext.Provider value={{ 
      user,
      session,
      isAuthenticated, 
      isLoading: loading, 
      isAdmin,
      signIn, 
      signUp,
      signOut 
    }}>
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
