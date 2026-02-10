import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'shiny-path:supabase_url';
const STORAGE_ANON_KEY = 'shiny-path:supabase_anon_key';

// Public defaults (safe to ship). This prevents the app from ever blocking on a
// setup screen just because Vite env vars aren't injected in a given preview
// origin.
const DEFAULT_SUPABASE_URL = 'https://qiuylxlpczlcmvnmaecm.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdXlseGxwY3psY212bm1hZWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkwMzI4NDAsImV4cCI6MjA4NDYwODg0MH0.cHLRtTTnGKonfWc3ye5jUgPBaeQLy4L34y7jscYbrqk';

function readConfig() {
  // In Vite, import.meta.env variables are compile-time replacements.
  // If they are not set for the frontend build, we fall back to localStorage.
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) ?? undefined : undefined;
  const storedAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) ?? undefined : undefined;

  // Priority: Vite env → localStorage (user override) → safe defaults
  const url = envUrl || storedUrl || DEFAULT_SUPABASE_URL;
  const anonKey = envAnon || storedAnon || DEFAULT_SUPABASE_ANON_KEY;

  return { url, anonKey };
}

export function setSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
}

export const supabaseConfig = readConfig();
export const hasSupabaseConfig = !!(supabaseConfig.url && supabaseConfig.anonKey);

console.log('Supabase Config Debug:', {
  url: supabaseConfig.url,
  hasAnonKey: !!supabaseConfig.anonKey,
  usingDefault: supabaseConfig.url === DEFAULT_SUPABASE_URL
});

// IMPORTANT: we don't throw here to avoid a blank screen.
// When config is missing, main.tsx renders a setup screen instead.
export const supabase = hasSupabaseConfig
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!)
  : createClient('http://localhost', 'public-anon-key');