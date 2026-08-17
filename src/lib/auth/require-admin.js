import "server-only";
import { getSessionFromCookies } from "@/lib/auth/session";

// Defense-in-depth: middleware protects /api/admin/**, but each route
// re-verifies independently rather than trusting middleware ran.
export async function requireAdmin() {
  const session = await getSessionFromCookies();
  if (!session?.isAdmin) return null;
  return session;
}
