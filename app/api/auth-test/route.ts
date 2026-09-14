import { NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { ensureBootstrapAdmin } from "@/lib/server/auth/bootstrap";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bootstrapResult = await ensureBootstrapAdmin();
    console.log("[auth-test] bootstrapResult:", bootstrapResult);

    const signInResult = await auth.api.signInUsername({
      body: {
        username: "admin",
        password: "admin",
      },
    });

    return NextResponse.json({
      ok: true,
      bootstrap: bootstrapResult,
      signIn: signInResult,
    });
  } catch (err: unknown) {
    const errorObj = err as { message?: string; stack?: string; name?: string };
    console.error("[auth-test ERROR]:", err);
    return NextResponse.json(
      {
        ok: false,
        name: errorObj?.name || "Error",
        error: errorObj?.message || String(err),
        stack: errorObj?.stack || "no-stack",
      },
      { status: 500 }
    );
  }
}
