import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;

/**
 * Returns a Supabase anon client, or null when env vars are missing
 * (e.g. CI/Vercel build before secrets are configured). Callers must
 * treat null as "no data" so prerender of shared layouts does not crash.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return null;
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return client;
}
