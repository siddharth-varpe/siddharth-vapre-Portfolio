import "server-only";
import { auth } from "./index";

export const BOOTSTRAP_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const BOOTSTRAP_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@siddharthvarpe.com";
export const BOOTSTRAP_ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "admin";

/**
 * =============================================================================
 * Idempotently initializes the initial admin bootstrap account.
 * Works across both Supabase PostgreSQL and fallback in-memory auth store.
 * =============================================================================
 */

let adminBootstrapped = false;
let adminUsingDefaultPassword = true;

export async function ensureBootstrapAdmin(): Promise<{
  created: boolean;
  message: string;
}> {
  if (adminBootstrapped) {
    return {
      created: false,
      message: "Admin account already exists. Bootstrap skipped.",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email: BOOTSTRAP_ADMIN_EMAIL,
        password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
        name: "Siddharth Varpe",
        username: BOOTSTRAP_ADMIN_USERNAME,
      },
    });

    adminBootstrapped = true;
    console.info("[Auth Bootstrap]: Initial admin bootstrap account created successfully.");

    return {
      created: true,
      message: "Admin bootstrap account created successfully.",
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const isAlreadyPresent =
      errMsg.toLowerCase().includes("already exists") ||
      errMsg.toLowerCase().includes("duplicate") ||
      errMsg.toLowerCase().includes("unique") ||
      errMsg.toLowerCase().includes("user already") ||
      errMsg.toLowerCase().includes("already taken");

    if (isAlreadyPresent) {
      adminBootstrapped = true;
      return {
        created: false,
        message: "Admin account already exists. Bootstrap skipped.",
      };
    }

    console.warn("[Auth Bootstrap]: Bootstrap registration note:", errMsg);
    return {
      created: false,
      message: `Bootstrap note: ${errMsg}`,
    };
  }
}

/**
 * Checks whether the current admin account is still using the default bootstrap password ("admin").
 * Used to display a prominent warning banner in the admin interface until changed.
 */
export async function isUsingBootstrapPassword(userId: string): Promise<boolean> {
  void userId;
  return adminUsingDefaultPassword;
}

/**
 * Marks that the password has been updated from the default bootstrap password.
 */
export function markBootstrapPasswordChanged(): void {
  adminUsingDefaultPassword = false;
}
