import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { updateAdminResume } from "@/lib/server/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(_req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const updated = await updateAdminResume(
      id,
      { active: true, archived: false },
      session.user.name || session.user.email || "admin"
    );

    if (!updated) {
      return NextResponse.json({ error: "Resume version not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Resume version ${updated.version} is now the active public resume.`,
      data: updated,
    });
  } catch (error) {
    console.error("[Admin Resume Activate Error]:", error);
    return NextResponse.json({ error: "Failed to activate resume version" }, { status: 500 });
  }
}
