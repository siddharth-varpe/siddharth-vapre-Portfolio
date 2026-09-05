import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { username } from "better-auth/plugins";
import { getRawDatabase } from "@/lib/server/db";

/**
 * Server-only Better Auth instance.
 *
 * Implements authoritative session management and administrative credentials
 * for Siddharth Varpe's personal portfolio.
 *
 * SECURITY CONTROLS:
 * - Credentials & secrets remain strictly server-side (enforced by 'server-only').
 * - Native MongoDB adapter using existing resilient connection pool.
 * - HTTP-only, secure, sameSite=lax session cookies.
 * - Built-in rate limiting on authentication mutations.
 * - 7-day session lifetime with 24-hour rolling updates.
 */

const authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret || authSecret.length < 32) {
  throw new Error(
    "SECURITY CONFIGURATION ERROR: BETTER_AUTH_SECRET must be defined and at least 32 characters long."
  );
}

const authBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(getRawDatabase(), {
    transaction: false,
  }),
  secret: authSecret,
  baseURL: authBaseUrl,
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4, // Permits bootstrap admin account; changed via password policy
  },
  plugins: [
    username(),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours rolling update
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache for fast lookups
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  rateLimit: {
    enabled: true,
    window: 60, // 60 seconds
    max: 5, // 5 attempts per window for brute-force defense
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
