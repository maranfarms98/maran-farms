import "server-only";
import { createClient } from "@supabase/supabase-js";

let client;

/**
 * Returns a service-role client, or null when env vars are missing.
 * Storefront data helpers use the anon client; admin/API must null-check
 * so builds (and misconfigured deploys) fail gracefully instead of throwing
 * inside @supabase/supabase-js.
 */
export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
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

export function requireSupabaseAdminClient() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them in the deployment environment (e.g. Vercel → Settings → Environment Variables).",
    );
  }
  return supabase;
}
