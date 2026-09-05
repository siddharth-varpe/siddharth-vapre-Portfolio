import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminContactMessages } from "@/lib/server/db";
import type { ContactMessageDocument } from "@/types";

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
    const status = searchParams.get("status") as ContactMessageDocument["status"] | null;

    const result = await getAdminContactMessages({
      page,
      limit,
      status: status ?? undefined,
    });
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[Admin Messages GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve messages" }, { status: 500 });
  }
}
