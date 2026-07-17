import "server-only";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Defense-in-depth: middleware protects /api/admin/**, but each route
// re-verifies independently rather than trusting middleware ran.
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySession(token);
  if (!session?.isAdmin) return null;
  return session;
}
