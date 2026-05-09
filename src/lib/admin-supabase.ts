import { createClient } from '@supabase/supabase-js';

/**
 * Admin-only Supabase client connected to a separate Supabase project.
 * This ensures complete data isolation between public users and admin systems.
 */
const adminUrl = import.meta.env.VITE_ADMIN_SUPABASE_URL;
const adminKey = import.meta.env.VITE_ADMIN_SUPABASE_PUBLISHABLE_KEY;

export const adminSupabase = createClient(adminUrl || '', adminKey || '', {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'corolas-admin-auth',
  },
});

export type AdminSupabaseClient = typeof adminSupabase;
