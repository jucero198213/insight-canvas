/**
 * Safe Supabase client wrapper that handles missing environment variables
 * by falling back to known publishable values.
 *
 * These are PUBLIC (anon) keys — safe to include in client-side code.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://hwabeqxbfwisrovszqbb.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3YWJlcXhiZndpc3JvdnN6cWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk4MTc2NzAsImV4cCI6MjA4NTM5MzY3MH0.W_j4XIofG-0PTciLY3q1qEa7JjmD0PxL4YkTxLeKdeU';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
