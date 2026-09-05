import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { updateAdminCertification, deleteAdminCertification } from "@/lib/server/db";
import { certificationMutationSchema } from "@/lib/validations/models";

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
    const parsed = certificationMutationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminCertification(
      id,
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    if (!updated) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Certification PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteAdminCertification(
      id,
      session.user.name || session.user.email || "admin"
    );

    if (!deleted) {
      return NextResponse.json({ error: "Certification not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Certification deleted successfully" });
  } catch (error) {
    console.error("[Admin Certification DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
