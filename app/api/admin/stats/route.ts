import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminDashboardStats } from "@/lib/server/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stats = await getAdminDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("[Admin Stats API Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve statistics" }, { status: 500 });
  }
}
