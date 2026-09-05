import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminSkills, createAdminSkill } from "@/lib/server/db";
import { skillMutationSchema } from "@/lib/validations/models";
import type { SkillDocument } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as SkillDocument["category"] | null;
    const skills = await getAdminSkills(category ?? undefined);
    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error("[Admin Skills GET Error]:", error);
    return NextResponse.json({ error: "Failed to retrieve skills" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await requireAdminSession({ isApi: true });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = skillMutationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const created = await createAdminSkill(
      parsed.data,
      session.user.name || session.user.email || "admin"
    );
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Admin Skills POST Error]:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
