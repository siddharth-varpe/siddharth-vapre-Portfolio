import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { deleteAdminMedia } from "@/lib/server/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteAdminMedia(
      id,
      session.user.name || session.user.email || "admin"
    );

    if (!deleted) {
      return NextResponse.json({ error: "Media metadata not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Media metadata deleted successfully" });
  } catch (error) {
    console.error("[Admin Media DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete media metadata" }, { status: 500 });
  }
}
