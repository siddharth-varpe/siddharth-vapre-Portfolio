import "server-only";
import { adminAuth } from "@/lib/firebase/admin";

export const BOOTSTRAP_ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const BOOTSTRAP_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@siddharthvarpe.com";
export const BOOTSTRAP_ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "admin123456";

/**
 * =============================================================================
 * Idempotently initializes the authoritative admin account in Firebase Authentication.
 * Sets the admin custom claim { admin: true } required by Firestore & Storage rules.
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
      message: "Admin account already initialized.",
    };
  }

  try {
    let user;
    try {
      user = await adminAuth.getUserByEmail(BOOTSTRAP_ADMIN_EMAIL);
    } catch (err: unknown) {
      const authErr = err as { code?: string };
      if (authErr.code === "auth/user-not-found") {
        user = await adminAuth.createUser({
          email: BOOTSTRAP_ADMIN_EMAIL,
          password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
          displayName: "Siddharth Varpe",
          emailVerified: true,
        });
        console.info("[Firebase Auth Bootstrap]: Created initial admin account:", BOOTSTRAP_ADMIN_EMAIL);
      } else {
        throw err;
      }
    }

    // Ensure admin custom claim is set
    if (!user.customClaims?.admin) {
      await adminAuth.setCustomUserClaims(user.uid, { admin: true });
      console.info("[Firebase Auth Bootstrap]: Assigned { admin: true } custom claim to admin user.");
    }

    adminBootstrapped = true;
    return {
      created: true,
      message: "Admin account verified and authorized with custom claims.",
    };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn("[Firebase Auth Bootstrap Note]:", errMsg);
    return {
      created: false,
      message: `Bootstrap note: ${errMsg}`,
    };
  }
}

export async function isUsingBootstrapPassword(userId?: string): Promise<boolean> {
  void userId;
  return adminUsingDefaultPassword;
}

export function markBootstrapPasswordChanged(): void {
  adminUsingDefaultPassword = false;
}
