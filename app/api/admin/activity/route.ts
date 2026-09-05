import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminActivityLogs } from "@/lib/server/db";
import type { ActivityLogDocument } from "@/types";

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
    const category = searchParams.get("category") as ActivityLogDocument["category"] | null;

    const result = await getAdminActivityLogs({
      page,
      limit,
      category: category ?? undefined,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Admin Activity GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve activity logs" }, { status: 500 });
  }
}
