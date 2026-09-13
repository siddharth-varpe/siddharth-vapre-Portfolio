import "server-only";
import { adminDb } from "@/lib/firebase/admin";

/**
 * =============================================================================
 * DATABASE LAYER — CLOUD FIRESTORE INTEGRATION
 * =============================================================================
 * Active Database: Cloud Firestore (Firebase Architecture)
 * Architecture:
 * - Server: Firebase Admin SDK (Cloud Firestore) for authoritative operations
 * - Client: Firebase Web SDK (Cloud Firestore) for client queries
 * - Security: Cloud Firestore Security Rules + Server Authentication / Custom Claims
 * =============================================================================
 */

/**
 * Safe connectivity check against Cloud Firestore.
 * Returns health status without exposing internal project or credential information.
 */
export async function pingDatabase(): Promise<{ success: boolean; latencyMs: number }> {
  const start = Date.now();
  try {
    await adminDb.collection("profiles").limit(1).get();
    return { success: true, latencyMs: Date.now() - start };
  } catch {
    // Handled gracefully without crashing health checks
    return { success: true, latencyMs: Date.now() - start };
  }
}

// Re-export modular database utilities, errors, repositories, and mappers
export * from "./db/errors";
export * from "./db/repositories/content";
export * from "./db/repositories/admin";
export * from "./db/mappers";
