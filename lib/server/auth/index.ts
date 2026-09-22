import "server-only";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { supabaseAdapter } from "./supabase-adapter";

/**
 * =============================================================================
 * Better Auth Server-Only Instance (Supabase PostgreSQL Architecture)
 * =============================================================================
 * Better Auth remains the authoritative authentication engine for this portfolio
 * (NOT replaced with Supabase Auth).
 *
 * It connects directly to the Supabase PostgreSQL 'user', 'session', 'account',
 * and 'verification' tables via the server-only Supabase adapter.
 * =============================================================================
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
  database: supabaseAdapter(),
  secret: authSecret,
  baseURL: authBaseUrl,
  trustedOrigins:
    process.env.NODE_ENV === "production"
      ? [
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          process.env.BETTER_AUTH_URL || "http://localhost:3000",
        ].filter(Boolean)
      : [
          "http://localhost:*",
          "http://127.0.0.1:*",
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          process.env.BETTER_AUTH_URL || "http://localhost:3000",
        ],
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
      },
    },
  },
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
    max: 10, // 10 attempts per window for brute-force defense
    storage: "memory", // Keep rate limiting in-memory to avoid requiring a separate rateLimit SQL table
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
