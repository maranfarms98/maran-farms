import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "maran_session";
const CANONICAL_HOST = "www.maranfarms.com";
const ALIAS_HOSTS = new Set(["maranfarms.com"]);

function requestHost(request) {
  const raw =
    request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
  return raw.split(",")[0].trim().split(":")[0].toLowerCase();
}

function canonicalRedirect(request) {
  const host = requestHost(request);
  if (!host || host === CANONICAL_HOST || host.endsWith(".vercel.app")) return null;
  if (!ALIAS_HOSTS.has(host)) return null;

  const destination = new URL(
    `${request.nextUrl.pathname}${request.nextUrl.search}`,
    `https://${CANONICAL_HOST}`,
  );
  return NextResponse.redirect(destination, 308);
}

async function verifyToken(token) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const redirect = canonicalRedirect(request);
  if (redirect) return redirect;

  const { pathname } = request.nextUrl;
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isAccountRoute = pathname.startsWith("/account");

  if (!isAdminRoute && !isAccountRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = await verifyToken(token);

  if (isAdminRoute && !payload?.isAdmin) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isAccountRoute && !payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|mp4|webm)$).*)",
  ],
};
