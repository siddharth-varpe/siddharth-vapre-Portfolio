import { z } from "zod";

/**
 * Public environment schema for Firebase Portfolio Architecture.
 * Safe for both client and server access.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  TURNSTILE_SITE_KEY: z.string().default(""),
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional().default(""),
  NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY: z.string().optional().default(""),
});

/**
 * Server-only environment schema.
 * Must NEVER be imported or accessed on the browser client.
 *
 * Cloud Firestore, Firebase Authentication, Cloud Storage for Firebase.
 */
const serverEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(4).optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL: z.string().email("CONTACT_EMAIL must be a valid email").optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validated public environment variables.
 */
export const publicEnv: PublicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  TURNSTILE_SITE_KEY:
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.TURNSTILE_SITE_KEY || "",
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || "",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY: process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY || "",
});

/**
 * Helper to safely retrieve server-only environment variables.
 * Throws immediately if accessed in a browser runtime context.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error(
      "SECURITY VIOLATION: Attempted to access server-only environment variables from the client."
    );
  }

  return serverEnvSchema.parse({
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  });
}
