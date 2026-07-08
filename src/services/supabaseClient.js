import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const missingSupabaseEnvVars = [
  ["VITE_SUPABASE_URL", supabaseUrl],
  ["VITE_SUPABASE_ANON_KEY", supabaseAnonKey],
].filter(([, value]) => !String(value || "").trim()).map(([name]) => name);

export const adminAllowedEmail = (import.meta.env.VITE_ADMIN_ALLOWED_EMAIL || "Vanuragverma2173@gmail.com").trim().toLowerCase();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: true },
  })
  : null;

export function hasSupabase() {
  return Boolean(supabase);
}

export function getMissingSupabaseEnvVars() {
  return missingSupabaseEnvVars;
}
