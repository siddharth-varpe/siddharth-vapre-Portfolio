import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getSkillsPageSettings, updateSkillsPageSettings } from "@/lib/server/db";
import { skillsPageSettingsSchema } from "@/lib/validations/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getSkillsPageSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("[Admin Skills Settings GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve skills settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = skillsPageSettingsSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const updated = await updateSkillsPageSettings(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Admin Skills Settings PUT Error]:", error);
    return NextResponse.json({ error: "Failed to update skills settings" }, { status: 500 });
  }
}
