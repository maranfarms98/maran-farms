import "server-only";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";

/**
 * Wraps a route handler so it only runs for admins. The verified session is
 * passed through on the context as `admin`.
 */
export function withAdmin(handler) {
  return async function adminRoute(request, context = {}) {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return handler(request, { ...context, admin });
  };
}
