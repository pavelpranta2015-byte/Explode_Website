import { createBrowserClient } from "@supabase/ssr";

/**
 * Client-side browser Supabase client.
 * Uses only public publishable/anon key under strict Row Level Security.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Graceful fallback during static build prerendering
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
