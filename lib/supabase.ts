import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// During build time, create a client with placeholder values to avoid build errors
// At runtime, actual values will be used and errors will occur when Supabase is called
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    // Only log errors in browser (runtime), not during build
    console.error('Missing Supabase environment variables!');
    console.error('URL:', supabaseUrl ? 'Set' : 'Missing');
    console.error('Key:', supabaseAnonKey ? 'Set' : 'Missing');
  }
}

export const supabase = createClient(url, key, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

