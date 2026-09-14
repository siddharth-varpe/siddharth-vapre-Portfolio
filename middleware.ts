import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge-Compatible Routing Middleware (Phase 4).
 *
 * DEFENSE-IN-DEPTH LAYER:
 * Provides preliminary edge redirection for unauthenticated visits to /admin routes.
 *
 * IMPORTANT SECURITY NOTE:
 * This middleware acts as a UX optimization and first defense line.
 * In accordance with SECURITY.md, authoritative authentication and authorization
 * are strictly enforced on the server inside Server Components (requireAdminSession),
 * Route Handlers, and Server Actions.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protect /admin routes (excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionToken =
      request.cookies.get("better-auth.session_token")?.value ||
      request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      const returnTo = encodeURIComponent(`${pathname}${search}`);
      const loginUrl = new URL(`/admin/login?returnTo=${returnTo}`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
  ],
};
