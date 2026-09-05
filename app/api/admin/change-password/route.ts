import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getRawDatabase } from "@/lib/server/db";
import { verifyPassword, hashPassword } from "better-auth/crypto";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

/**
 * Protected Admin Route: Change Password.
 *
 * Enforces:
 * 1. Valid authenticated admin session.
 * 2. Strict Zod schema validation (min 8 chars, uppercase, number).
 * 3. Server-side verification of current password hash.
 * 4. Scrypt re-hashing with cryptographic salt.
 * 5. Invalidation of all other sessions to terminate potentially hijacked tokens.
 */
export async function POST(request: NextRequest) {
  const sessionContext = await requireAdminSession({ isApi: true });

  if (!sessionContext) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const json = await request.json().catch(() => ({}));
    const parseResult = changePasswordSchema.safeParse(json);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parseResult.data;
    const userId = sessionContext.user.id;
    const db = getRawDatabase();

    // Retrieve account record
    const account = await db.collection("account").findOne({
      $or: [{ userId: userId }, { accountId: userId }],
      providerId: "credential",
    });

    if (!account || !account.password) {
      return NextResponse.json(
        { error: "Account error", message: "Credential account not found" },
        { status: 404 }
      );
    }

    // Verify current password
    const isCurrentValid = await verifyPassword({
      password: currentPassword,
      hash: account.password,
    });

    if (!isCurrentValid) {
      return NextResponse.json(
        { error: "Invalid credentials", message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password securely
    const newHashedPassword = await hashPassword(newPassword);

    // Update account record
    await db.collection("account").updateOne(
      { _id: account._id },
      {
        $set: {
          password: newHashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    // Revoke all other sessions for this user to mitigate session hijacking
    await db.collection("session").deleteMany({
      $or: [{ userId: userId }, { userId: account.userId }],
      token: { $ne: sessionContext.session.token },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully. All other sessions have been revoked.",
    });
  } catch (error) {
    console.error("[Change Password Error]:", error);
    return NextResponse.json(
      { error: "Internal Error", message: "Failed to update password" },
      { status: 500 }
    );
  }
}
