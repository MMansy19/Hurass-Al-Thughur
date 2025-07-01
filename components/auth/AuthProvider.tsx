"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/supabase/initializing';
import { handleAuthError, isAuthError, refreshSessionSafely, getSessionSafely } from '@/utils/auth-helpers';
import { TokenManager } from '@/utils/token-manager';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    const { session, error } = await refreshSessionSafely();
    
    if (error) {
      setUser(null);
      setSession(null);
    } else if (session) {
      setUser(session.user);
      setSession(session);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      // Clear state regardless of error
      setUser(null);
      setSession(null);
      // Clear any remaining localStorage data
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error);
    }
  };

  useEffect(() => {
    // Initialize token manager
    TokenManager.init();

    // Get initial session
    const getInitialSession = async () => {
      const { session, error } = await getSessionSafely();
      
      if (error || !session) {
        setUser(null);
        setSession(null);
      } else {
        setUser(session.user);
        setSession(session);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        try {
          if (event === 'SIGNED_IN' && session) {
            setUser(session.user);
            setSession(session);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setSession(null);
            // Clear localStorage
            if (typeof window !== 'undefined') {
              window.localStorage.removeItem('user');
            }
          } else if (event === 'TOKEN_REFRESHED' && session) {
            setUser(session.user);
            setSession(session);
          } else if (event === 'USER_UPDATED' && session) {
            setUser(session.user);
            setSession(session);
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          if (isAuthError(error)) {
            await handleAuthError(error, {
              redirectOnError: false,
              clearSession: true,
              showAlert: false
            });
          }
          setUser(null);
          setSession(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signOut,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
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
