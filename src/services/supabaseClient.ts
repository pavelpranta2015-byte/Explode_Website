/**
 * Supabase Client Configuration Interface
 *
 * To connect Supabase:
 * 1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 * 2. Install `@supabase/supabase-js`
 * 3. Uncomment the client below.
 *
 * All frontend service interfaces in `src/services/api.ts` are pre-structured
 * to map 1:1 with standard Supabase tables:
 * - products
 * - product_variants
 * - categories
 * - orders
 * - order_items
 * - profiles
 * - reviews
 */

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
