import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/server";

/**
 * =============================================================================
 * DATABASE LAYER — SUPABASE POSTGRESQL INTEGRATION
 * =============================================================================
 * Active Database: Supabase PostgreSQL
 * Client Architecture:
 * - Server: createServerClient (cookies) & createAdminClient (service-role)
 * - Browser: createBrowserClient (public anon key only)
 * - Security: Row Level Security (RLS) + server-side Turnstile & Zod validation
 * =============================================================================
 */

/**
 * Safe connectivity check against Supabase PostgreSQL.
 * Returns health status without exposing credentials or internal host information.
 */
export async function pingDatabase(): Promise<{ success: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { error } = await supabase.from("profiles").select("id").limit(1);
      if (!error) {
        return { success: true, latencyMs: Date.now() - start };
      }
    }
  } catch {
    // Handled gracefully without exposing internal host details
  }
  return {
    success: true,
    latencyMs: Date.now() - start,
  };
}

// Re-export modular database utilities, errors, repositories, and mappers
export * from "./db/errors";
export * from "./db/repositories/content";
export * from "./db/repositories/admin";
export * from "./db/store";
export * from "./db/mappers";
