import { createClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'shiny-path:supabase_url';
const STORAGE_ANON_KEY = 'shiny-path:supabase_anon_key';

function readConfig() {
  // In Vite, import.meta.env variables are compile-time replacements.
  // If they are not set for the frontend build, we fall back to localStorage.
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const envAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_URL_KEY) ?? undefined : undefined;
  const storedAnon = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_ANON_KEY) ?? undefined : undefined;

  const url = envUrl || storedUrl;
  const anonKey = envAnon || storedAnon;

  return { url, anonKey };
}

export function setSupabaseConfig(url: string, anonKey: string) {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
}

export const supabaseConfig = readConfig();
export const hasSupabaseConfig = !!(supabaseConfig.url && supabaseConfig.anonKey);

// IMPORTANT: we don't throw here to avoid a blank screen.
// When config is missing, main.tsx renders a setup screen instead.
export const supabase = hasSupabaseConfig
  ? createClient(supabaseConfig.url!, supabaseConfig.anonKey!)
  : createClient('http://localhost', 'public-anon-key');