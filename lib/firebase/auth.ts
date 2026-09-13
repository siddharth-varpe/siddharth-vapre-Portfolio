import "server-only";
import { adminAuth } from "./admin";

export const SESSION_COOKIE_NAME = "__session"; // Firebase App Hosting and CDN whitelist cookie
export const SESSION_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export interface VerifiedAdminSession {
  uid: string;
  email?: string;
  name?: string;
  admin: boolean;
}

/**
 * Creates a secure Firebase Auth Session Cookie from a client ID token.
 */
export async function createAdminSessionCookie(idToken: string): Promise<{
  cookie: string;
  expiresIn: number;
  user: { uid: string; email?: string; name?: string };
}> {
  // 1. Verify incoming ID token
  const decoded = await adminAuth.verifyIdToken(idToken, true);

  // 2. Authorize admin custom claim
  const isBootstrapAdmin =
    decoded.email &&
    decoded.email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@siddharthvarpe.com").toLowerCase();

  if (!decoded.admin && isBootstrapAdmin) {
    // Automatically set custom claim for authoritative admin account
    await adminAuth.setCustomUserClaims(decoded.uid, { admin: true });
    decoded.admin = true;
  }

  if (!decoded.admin) {
    throw new Error("UNAUTHORIZED: User does not possess administrative privileges.");
  }

  // 3. Create session cookie
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRATION_MS,
  });

  return {
    cookie: sessionCookie,
    expiresIn: SESSION_EXPIRATION_MS,
    user: {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email?.split("@")[0] || "Admin",
    },
  };
}

/**
 * Authoritatively verifies a session cookie on the server.
 */
export async function verifyAdminSessionCookie(
  sessionCookie: string
): Promise<VerifiedAdminSession | null> {
  if (!sessionCookie || sessionCookie.trim().length === 0) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decoded || !decoded.admin) {
      return null;
    }

    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name || decoded.email?.split("@")[0] || "Admin",
      admin: Boolean(decoded.admin),
    };
  } catch {
    // Expired or revoked session
    return null;
  }
}

/**
 * Revokes refresh tokens associated with a session cookie upon logout.
 */
export async function revokeAdminSession(sessionCookie: string): Promise<void> {
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, false);
    if (decoded?.sub) {
      await adminAuth.revokeRefreshTokens(decoded.sub);
    }
  } catch {
    // Session already invalid
  }
}

/**
 * Sets explicit administrative custom claim for a user UID.
 */
export async function setAdminCustomClaim(uid: string): Promise<void> {
  await adminAuth.setCustomUserClaims(uid, { admin: true });
}
