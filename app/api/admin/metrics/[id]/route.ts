import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { updateAdminMetric, deleteAdminMetric } from "@/lib/server/db";
import { metricMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = metricMutationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminMetric(
      id,
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    if (!updated) {
      return NextResponse.json({ error: "Metric not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Metric PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update metric" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteAdminMetric(
      id,
      session.user.name || session.user.email || "admin"
    );

    if (!deleted) {
      return NextResponse.json({ error: "Metric not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Metric deleted successfully" });
  } catch (error) {
    console.error("[Admin Metric DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete metric" }, { status: 500 });
  }
}
