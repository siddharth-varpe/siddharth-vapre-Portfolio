import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminMetrics, createAdminMetric } from "@/lib/server/db";
import { metricMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await getAdminMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error("[Admin Metrics GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve metrics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = metricMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminMetric(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Metrics POST Error]:", error);
    return NextResponse.json({ error: "Failed to create metric" }, { status: 500 });
  }
}
