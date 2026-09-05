import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminRevisions } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "20", 10);
    const contentId = searchParams.get("contentId") ?? undefined;

    const result = await getAdminRevisions(contentId, { page, limit });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Admin Revisions GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve revisions" }, { status: 500 });
  }
}
