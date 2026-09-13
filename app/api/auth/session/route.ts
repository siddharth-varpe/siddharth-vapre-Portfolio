import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSessionCookie, SESSION_COOKIE_NAME } from "@/lib/firebase/auth";
import { getServerSession } from "@/lib/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * Session verification & cookie establishment endpoint.
 * Accepts client ID token, validates administrator claim, and sets HTTP-only __session cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json(
        { error: "Bad Request", message: "A valid Firebase ID token is required." },
        { status: 400 }
      );
    }

    const { cookie, expiresIn, user } = await createAdminSessionCookie(idToken);

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, cookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user,
      message: "Admin session established successfully.",
    });
  } catch (error: unknown) {
    console.error("[Session Route Error]:", error instanceof Error ? error.message : String(error));
    const msg = error instanceof Error ? error.message : String(error);
    const isUnauthorized = msg.includes("UNAUTHORIZED");
    return NextResponse.json(
      {
        error: isUnauthorized ? "Unauthorized" : "Authentication Failed",
        message: msg || "Failed to establish administrative session.",
      },
      { status: isUnauthorized ? 403 : 401 }
    );
  }
}

/**
 * Returns current authenticated admin session status.
 */
export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ session: null, user: null }, { status: 200 });
  }

  return NextResponse.json({
    session: session.session,
    user: session.user,
  });
}
