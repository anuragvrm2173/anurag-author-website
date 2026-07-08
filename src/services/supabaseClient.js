import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const adminAllowedEmail = (import.meta.env.VITE_ADMIN_ALLOWED_EMAIL || "Vanuragverma2173@gmail.com").trim().toLowerCase();

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })
  : null;

export function hasSupabase() {
  return Boolean(supabase);
}
