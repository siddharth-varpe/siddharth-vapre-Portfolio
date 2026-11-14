import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { updateAdminSkillCategory, deleteAdminSkillCategory } from "@/lib/server/db";
import { skillCategoryMutationSchema } from "@/lib/validations/models";

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
    const parsed = skillCategoryMutationSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateAdminSkillCategory(
      id,
      parsed.data,
      session.user.name || session.user.email || "admin"
    );

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Skill Category PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update skill category" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: RouteParams) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await deleteAdminSkillCategory(
      id,
      session.user.name || session.user.email || "admin"
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to delete category" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Skill category deleted successfully" });
  } catch (error) {
    console.error("[Admin Skill Category DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete skill category" }, { status: 500 });
  }
}
