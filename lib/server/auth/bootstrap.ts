import "server-only";
import { getRawDatabase } from "@/lib/server/db";
import { auth } from "./index";
import { verifyPassword } from "better-auth/crypto";

export const BOOTSTRAP_ADMIN_USERNAME = "admin";
export const BOOTSTRAP_ADMIN_EMAIL = "admin@siddharthvarpe.com";
export const BOOTSTRAP_ADMIN_DEFAULT_PASSWORD = "admin";

/**
 * Idempotently initializes the initial admin bootstrap account.
 *
 * Checks MongoDB Atlas `user` collection.
 * - If admin exists, takes NO action (preserves updated production passwords).
 * - If absent, creates the account with hashed credentials using Better Auth.
 *
 * Plaintext passwords are NEVER stored in the database.
 */
export async function ensureBootstrapAdmin(): Promise<{
  created: boolean;
  message: string;
}> {
  const db = getRawDatabase();
  const existingAdmin = await db.collection("user").findOne({
    username: BOOTSTRAP_ADMIN_USERNAME,
  });

  if (existingAdmin) {
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

    console.info("[Auth Bootstrap]: Initial admin bootstrap account created successfully.");

    return {
      created: true,
      message: "Admin bootstrap account created successfully.",
    };
  } catch (error) {
    console.error("[Auth Bootstrap Error]: Failed to create bootstrap account", error);
    throw error;
  }
}

/**
 * Checks whether the current admin account is still using the default bootstrap password ("admin").
 * Used to display a prominent warning banner in the admin interface until changed.
 */
export async function isUsingBootstrapPassword(userId: string): Promise<boolean> {
  try {
    const db = getRawDatabase();
    // Better Auth stores userId either as ObjectId or string in account collection
    const account = await db.collection("account").findOne({
      $or: [
        { userId: userId },
        { accountId: userId },
      ],
      providerId: "credential",
    });

    if (!account || !account.password) {
      return false;
    }

    // Verify if password matches default "admin"
    const isDefault = await verifyPassword({
      password: BOOTSTRAP_ADMIN_DEFAULT_PASSWORD,
      hash: account.password,
    });

    return isDefault;
  } catch (error) {
    console.error("[Auth Bootstrap Check Error]:", error);
    return false;
  }
}
