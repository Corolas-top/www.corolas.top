import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { adminSupabase } from '@/lib/admin-supabase';
import bcrypt from 'bcryptjs';
import type {} from '@supabase/supabase-js';

/* ─── Types ─── */

export interface AdminUser {
  id: string;
  username: string;
  role: 'superadmin' | 'admin';
  created_at: string;
}

export interface AIAgent {
  id: string;
  name: string;
  api_key: string;
  permissions: Record<string, boolean>;
  is_active: boolean;
  last_accessed_at: string | null;
  created_at: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AdminAuthContextType extends AdminAuthState {
  login: (username: string, password: string) => Promise<{ error: string | null }>;
  aiLogin: (apiKey: string, password: string) => Promise<{ error: string | null; agent?: AIAgent }>;
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

const ADMIN_TOKEN_KEY = 'corolas_admin_token';
const ADMIN_USER_KEY = 'corolas_admin_user';

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(true);

  /* ── Validate stored session on mount ── */
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);
        const storedUser = localStorage.getItem(ADMIN_USER_KEY);

        if (!token || !storedUser) {
          if (mountedRef.current) setIsLoading(false);
          return;
        }

        // Verify token is still valid by checking with Supabase
        const { data: { user }, error } = await adminSupabase.auth.getUser(token);

        if (error || !user) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem(ADMIN_USER_KEY);
          if (mountedRef.current) setIsLoading(false);
          return;
        }

        // Fetch admin record from database
        const { data: adminRecord } = await adminSupabase
          .from('admins')
          .select('id, username, role, created_at')
          .eq('id', user.id)
          .single();

        if (adminRecord && mountedRef.current) {
          setAdmin(adminRecord as AdminUser);
        } else {
          // User exists in auth but not in admins table
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem(ADMIN_USER_KEY);
        }
      } catch {
        // Silent fail
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    };

    validateSession();
    return () => { mountedRef.current = false; };
  }, []);

  /* ── Login with username/password ── */
  const login = useCallback(async (username: string, password: string) => {
    try {
      // 1. Find admin by username
      const { data: adminRecord, error: findError } = await adminSupabase
        .from('admins')
        .select('id, username, password_hash, role, created_at')
        .eq('username', username)
        .single();

      if (findError || !adminRecord) {
        return { error: 'Invalid username or password' };
      }

      // 2. Verify bcrypt password
      const isValid = await bcrypt.compare(password, adminRecord.password_hash);
      if (!isValid) {
        return { error: 'Invalid username or password' };
      }

      // 3. Create a session using Supabase auth (sign in with a service approach)
      // Since we can't use passwords directly with Supabase auth,
      // we use a custom JWT approach
      const { data: sessionData, error: sessionError } = await adminSupabase.auth.signInWithPassword({
        email: `${username}@admin.corolas.local`,
        password: password,
      });

      if (sessionError) {
        // Fallback: try to sign up first (admin accounts are pre-created in DB)
        // If the auth user doesn't exist, we can't log in
        // This requires admins to be created in both auth.users and public.admins
        return { error: 'Authentication failed. Ensure admin account is properly configured.' };
      }

      const token = sessionData.session?.access_token;
      if (!token) {
        return { error: 'Failed to create session' };
      }

      // 4. Store session
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      const adminUser: AdminUser = {
        id: adminRecord.id,
        username: adminRecord.username,
        role: adminRecord.role,
        created_at: adminRecord.created_at,
      };
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminUser));
      setAdmin(adminUser);

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  }, []);

  /* ── AI Agent login ── */
  const aiLogin = useCallback(async (apiKey: string, password: string) => {
    try {
      // 1. Find agent by API key
      const { data: agent, error: findError } = await adminSupabase
        .from('ai_agents')
        .select('id, name, api_key, password_hash, permissions, is_active, last_accessed_at, created_at')
        .eq('api_key', apiKey)
        .single();

      if (findError || !agent) {
        return { error: 'Invalid API key or password' };
      }

      if (!agent.is_active) {
        return { error: 'This AI agent account is disabled' };
      }

      // 2. Verify bcrypt password
      const isValid = await bcrypt.compare(password, agent.password_hash);
      if (!isValid) {
        return { error: 'Invalid API key or password' };
      }

      // 3. Update last accessed
      await adminSupabase
        .from('ai_agents')
        .update({ last_accessed_at: new Date().toISOString() })
        .eq('id', agent.id);

      const agentData: AIAgent = {
        id: agent.id,
        name: agent.name,
        api_key: agent.api_key,
        permissions: agent.permissions as Record<string, boolean>,
        is_active: agent.is_active,
        last_accessed_at: new Date().toISOString(),
        created_at: agent.created_at,
      };

      return { error: null, agent: agentData };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
    adminSupabase.auth.signOut().catch(() => {});
    setAdmin(null);
  }, []);

  /* ── Refresh session ── */
  const refreshSession = useCallback(async () => {
    try {
      const { data: { session } } = await adminSupabase.auth.getSession();
      if (session?.access_token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, session.access_token);
      }
    } catch {
      // Silent fail
    }
  }, []);

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    login,
    aiLogin,
    logout,
    refreshSession,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
