import { z } from "zod";

/**
 * Public environment schema.
 * Safe for client and server access.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  TURNSTILE_SITE_KEY: z.string().default(""),
});

/**
 * Server-only environment schema.
 * Must NEVER be imported or accessed on the browser client.
 */
const serverEnvSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required").optional(),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters").optional(),
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required").optional(),
  CONTACT_EMAIL: z.string().email("CONTACT_EMAIL must be a valid email").optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1, "TURNSTILE_SECRET_KEY is required").optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, "BLOB_READ_WRITE_TOKEN is required").optional(),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Validated public environment variables.
 */
export const publicEnv: PublicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  TURNSTILE_SITE_KEY: process.env.TURNSTILE_SITE_KEY || "",
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
    MONGODB_URI: process.env.MONGODB_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_EMAIL: process.env.CONTACT_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  });
}
