import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession, assertResourceAccess } from "@/lib/server/auth/session";

/**
 * Test Protected Route Handler (Phase 4 Verification).
 *
 * Verifies server-side authorization enforcement:
 * - Returns 401 Unauthorized for requests without valid session.
 * - Returns 200 OK for valid authenticated admin sessions.
 * - Verifies IDOR / BOLA authorization on POST mutations.
 */
export async function GET() {
  const sessionContext = await requireAdminSession({ isApi: true });

  if (!sessionContext) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Admin authentication required" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: sessionContext.user.id,
      name: sessionContext.user.name,
      username: (sessionContext.user as { username?: string }).username,
      email: sessionContext.user.email,
    },
  });
}

export async function POST(request: NextRequest) {
  const sessionContext = await requireAdminSession({ isApi: true });

  if (!sessionContext) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Admin authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { targetOwnerId } = body;

    if (targetOwnerId) {
      assertResourceAccess(targetOwnerId, sessionContext.user.id);
    }

    return NextResponse.json({
      success: true,
      message: "Authorized mutation executed successfully",
      resourceOwnerId: targetOwnerId || sessionContext.user.id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    return NextResponse.json(
      { error: "Forbidden", message },
      { status: 403 }
    );
  }
}
