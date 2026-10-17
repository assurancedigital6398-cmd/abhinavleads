import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are placeholders or properly configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') && 
  !supabaseAnonKey.includes('your-anon-key')
);

if (!isSupabaseConfigured) {
  console.info(
    '%c[Supabase Notice]%c Please add your valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.',
    'background: #1268F3; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: #0B1A33; font-weight: 500;'
  );
}

// Fallback dummy URL & key to prevent createClient from crashing on startup
const effectiveUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder-project.supabase.co';
const effectiveKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(effectiveUrl, effectiveKey);
