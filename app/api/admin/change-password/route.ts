import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/server/auth/session";
import { adminAuth } from "@/lib/firebase/admin";
import { markBootstrapPasswordChanged } from "@/lib/server/auth/bootstrap";

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
 * =============================================================================
 * Protected Admin Route: Change Password (Firebase Authentication)
 * =============================================================================
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

    const { newPassword } = parseResult.data;

    try {
      await adminAuth.updateUser(sessionContext.user.id, {
        password: newPassword,
      });
      await adminAuth.revokeRefreshTokens(sessionContext.user.id);
      markBootstrapPasswordChanged();
    } catch (authError) {
      console.error("[Change Password Firebase Auth Error]:", authError);
      return NextResponse.json(
        { error: "Authentication error", message: "Failed to update credentials in Firebase Auth" },
        { status: 400 }
      );
    }

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
