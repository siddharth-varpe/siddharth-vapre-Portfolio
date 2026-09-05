import "server-only";
import { headers } from "next/headers";
import { auth, type Session, type User } from "./index";
import { getSafeRedirectUrl } from "./redirects";
import { assertResourceAccess } from "./authorization";

export { assertResourceAccess };

export interface SessionContext {
  session: Session;
  user: User;
}

/**
 * Retrieves the current authenticated session from incoming request headers.
 * Safe to call in Server Components, Route Handlers, and Server Actions.
 *
 * @returns SessionContext or null if unauthenticated.
 */
export async function getServerSession(): Promise<SessionContext | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session || !session.session || !session.user) {
      return null;
    }

    return session as unknown as SessionContext;
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
    console.error("[Auth Server Session Error]: Failed to retrieve session", error);
    return null;
  }
}

/**
 * Server-side guard enforcing administrative authentication.
 *
 * BEHAVIOR:
 * - For Server Components: Redirects to `/admin/login?returnTo=...` when unauthenticated.
 * - For API Route Handlers (`isApi: true`): Returns null so caller can return a 401 JSON response.
 *
 * @param options Configuration options
 * @returns SessionContext if authenticated; throws redirect for pages or returns null for APIs.
 */
export async function requireAdminSession(options?: {
  isApi?: boolean;
  returnTo?: string;
}): Promise<SessionContext | null> {
  const sessionContext = await getServerSession();

  if (!sessionContext) {
    if (options?.isApi) {
      return null;
    }

    const safeReturnTo = getSafeRedirectUrl(options?.returnTo, "/admin");
    const { redirect } = await import("next/navigation");
    redirect(`/admin/login?returnTo=${encodeURIComponent(safeReturnTo)}`);
  }

  return sessionContext;
}

