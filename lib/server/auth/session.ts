import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSessionCookie, SESSION_COOKIE_NAME } from "@/lib/firebase/auth";
import { getSafeRedirectUrl } from "./redirects";
import { assertResourceAccess } from "./authorization";

export { assertResourceAccess };

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export interface SessionContext {
  session: AuthSession;
  user: AuthUser;
}

/**
 * Retrieves the authenticated administrator session from the incoming __session cookie.
 * Authoritatively verified by Firebase Admin SDK.
 * Safe for Server Components, Route Handlers, and Server Actions.
 */
export async function getServerSession(): Promise<SessionContext | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      return null;
    }

    const verified = await verifyAdminSessionCookie(sessionCookie);
    if (!verified || !verified.admin) {
      return null;
    }

    return {
      session: {
        id: verified.uid,
        userId: verified.uid,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      user: {
        id: verified.uid,
        email: verified.email || "admin@siddharthvarpe.com",
        name: verified.name || "Admin",
        role: "admin",
      },
    };
  } catch (error: unknown) {
    // Let Next.js dynamic rendering bailout pass through cleanly
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      typeof (error as { digest: unknown }).digest === "string" &&
      ((error as { digest: string }).digest.startsWith("DYNAMIC_SERVER_USAGE") ||
        (error as { digest: string }).digest.startsWith("NEXT_REDIRECT"))
    ) {
      throw error;
    }
    console.error("[Firebase Auth Session Error]: Failed to retrieve server session:", error);
    return null;
  }
}

/**
 * Server-side guard enforcing administrative authentication.
 *
 * BEHAVIOR:
 * - For Server Components: Redirects to /admin/login?returnTo=... when unauthenticated.
 * - For API Route Handlers (isApi: true): Returns null so caller can return a 401 JSON response.
 */
export async function requireAdminSession(options?: {
  isApi?: boolean;
  returnTo?: string;
}): Promise<SessionContext | null> {
  const session = await getServerSession();

  if (!session) {
    if (options?.isApi) {
      return null;
    }

    const safeReturn = getSafeRedirectUrl(options?.returnTo, "/admin");
    const loginUrl = `/admin/login?returnTo=${encodeURIComponent(safeReturn)}`;
    redirect(loginUrl);
  }

  return session;
}
