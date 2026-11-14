import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/server/auth/session";
import { getAdminPageHeroes, updateAdminPageHero } from "@/lib/server/db";
import { pageHeroConfigSchema } from "@/lib/validations/models";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updatePageHeroBodySchema = z.object({
  pageKey: z.string().trim().min(1).max(50),
  heroConfig: pageHeroConfigSchema,
});

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const heroes = await getAdminPageHeroes();
    return NextResponse.json({ heroes });
  } catch (error) {
    console.error("[API Error] Failed to retrieve page heroes:", error);
    return NextResponse.json({ error: "Failed to retrieve page heroes" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updatePageHeroBodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { pageKey, heroConfig } = parsed.data;
    const actor = session.user?.email || session.user?.id || "admin";

    const updatedHero = await updateAdminPageHero(pageKey, heroConfig, actor);

    return NextResponse.json({
      success: true,
      message: `Page hero for "${pageKey}" updated successfully`,
      hero: updatedHero,
    });
  } catch (error) {
    console.error("[API Error] Failed to update page hero:", error);
    return NextResponse.json({ error: "Failed to update page hero" }, { status: 500 });
  }
}
