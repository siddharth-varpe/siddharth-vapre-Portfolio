import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSkillCategories, createAdminSkillCategory } from "@/lib/server/db";
import { skillCategoryMutationSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const categories = await getAdminSkillCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("[Admin Skill Categories GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve skill categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = skillCategoryMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminSkillCategory(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Skill Category POST Error]:", error);
    return NextResponse.json({ error: "Failed to create skill category" }, { status: 500 });
  }
}
