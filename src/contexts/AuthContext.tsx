import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

/* ─── Types ─── */

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, username: string) => Promise<{ error: AuthError | null; needsEmailConfirmation: boolean }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'username' | 'avatar_url'>>) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | null }>;
}

/* ─── Timeout wrapper ─── */

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

/* ─── Context ─── */

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/* ─── Provider ─── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  /* ── Fetch profile (safe, no await in onAuthStateChange) ── */
  const fetchProfile = useCallback((userId: string) => {
    // MUST NOT be awaited inside onAuthStateChange — use setTimeout to break out
    setTimeout(async () => {
      if (!mountedRef.current) return;
      try {
        const { data, error } = await withTimeout(
          Promise.resolve(supabase.from('profiles').select('id, username, avatar_url, updated_at').eq('id', userId).single()),
          8000,
          'Profile fetch'
        );
        if (!mountedRef.current) return;
        if (!error && data) {
          setProfile(data as Profile);
          return;
        }
      } catch {
        // Silently fall through
      }
      // Fallback: build from user metadata
      setProfile({ id: userId, username: null, avatar_url: null, updated_at: null });
    }, 0);
  }, []);

  /* ── Initialize session ── */
  useEffect(() => {
    mountedRef.current = true;

    const initSession = async () => {
      try {
        const { data: { session } } = await withTimeout(
          supabase.auth.getSession(),
          8000,
          'Session init'
        );
        if (!mountedRef.current) return;

        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    initSession();

    return () => { mountedRef.current = false; };
  }, [fetchProfile]);

  /* ── Listen for auth state changes ──
   * CRITICAL: This callback MUST be synchronous (no async/await).
   * Awaiting any Supabase call inside onAuthStateChange triggers a
   * deadlock (supabase/gotrue-js#762) that permanently freezes the
   * auth client.  All follow-up work is deferred via setTimeout.
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  /* ── Actions (all with timeout) ── */

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password }),
        15000,
        'Sign in'
      );
      return { error };
    } catch (err) {
      return { error: { message: (err as Error).message, name: 'TimeoutError' } as AuthError };
    }
  };

  const signUpWithEmail = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        }),
        15000,
        'Sign up'
      );
      const needsEmailConfirmation = !data?.session && !error;
      return { error, needsEmailConfirmation };
    } catch (err) {
      return {
        error: { message: (err as Error).message, name: 'TimeoutError' } as AuthError,
        needsEmailConfirmation: false,
      };
    }
  };

  const signOut = async () => {
    try {
      await withTimeout(supabase.auth.signOut(), 10000, 'Sign out');
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Pick<Profile, 'username' | 'avatar_url'>>) => {
    if (!user) return { error: new Error('Not authenticated') };
    try {
      const { error } = await withTimeout(
        Promise.resolve(supabase.from('profiles').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', user.id)),
        10000,
        'Profile update'
      );
      if (!error) setProfile((prev) => prev ? { ...prev, ...updates } : null);
      return { error };
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Update failed') };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.updateUser({ password: newPassword }),
        15000,
        'Password update'
      );
      return { error };
    } catch (err) {
      return { error: { message: (err as Error).message, name: 'TimeoutError' } as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        }),
        15000,
        'Reset password'
      );
      return { error };
    } catch (err) {
      return { error: { message: (err as Error).message, name: 'TimeoutError' } as AuthError };
    }
  };

  const resendConfirmation = async (email: string) => {
    try {
      const { error } = await withTimeout(
        supabase.auth.resend({ type: 'signup', email }),
        15000,
        'Resend confirmation'
      );
      return { error };
    } catch (err) {
      return { error: { message: (err as Error).message, name: 'TimeoutError' } as AuthError };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateProfile,
    updatePassword,
    resetPassword,
    resendConfirmation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
