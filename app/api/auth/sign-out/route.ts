import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeAdminSession, SESSION_COOKIE_NAME } from "@/lib/firebase/auth";

export const dynamic = "force-dynamic";

/**
 * Administrative logout endpoint.
 * Revokes refresh tokens and clears the __session cookie.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionCookie) {
      await revokeAdminSession(sessionCookie);
    }

    cookieStore.set(SESSION_COOKIE_NAME, "", {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error: unknown) {
    console.error("[Sign Out Route Error]:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({
      success: true,
      message: "Logged out.",
    });
  }
}
