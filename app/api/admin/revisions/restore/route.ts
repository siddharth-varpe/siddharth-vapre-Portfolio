import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { restoreRevision } from "@/lib/server/db";
import { restoreRevisionSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = restoreRevisionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    await restoreRevision(
      parsed.data.revisionId,
      session.user.name || session.user.email || "admin"
    );

    return NextResponse.json({ success: true, message: "Revision restored successfully" });
  } catch (error) {
    console.error("[Admin Revision Restore Error]:", error);
    return NextResponse.json({ error: "Failed to restore revision" }, { status: 500 });
  }
}
