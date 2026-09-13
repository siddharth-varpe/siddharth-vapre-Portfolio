import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge-Compatible Routing Middleware
 *
 * DEFENSE-IN-DEPTH LAYER:
 * Provides preliminary edge redirection for unauthenticated visits to /admin routes.
 *
 * Firebase App Hosting & Cloud CDN preserve the __session cookie across edge routing.
 * Authoritative verification is enforced on the server inside Server Components (requireAdminSession),
 * Route Handlers, and Server Actions via Firebase Admin SDK.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Protect /admin routes (excluding /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const sessionCookie = request.cookies.get("__session")?.value;

    if (!sessionCookie) {
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
